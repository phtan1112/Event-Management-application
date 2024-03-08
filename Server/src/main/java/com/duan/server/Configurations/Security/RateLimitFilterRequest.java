package com.duan.server.Configurations.Security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component
public class RateLimitFilterRequest implements Filter {

    // use ConcurrentHashMap<> for support good thread and avoid race conditions.
    private final Map<String, Bucket> tokenBuckets = new ConcurrentHashMap<>();
    private static final int EXPIRATION_CHECK_INTERVAL = 1; //minutes, 1min for 10 requests
    private static final int REQUEST_LIMIT = 10; // number of requests

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        final HttpServletRequest httpRequest = (HttpServletRequest) request;
        final HttpServletResponse httpServletResponse= (HttpServletResponse) response;
        String authHeader = httpRequest.getHeader("Authorization");

        if(StringUtils.isEmpty(authHeader)
                || !org.apache.commons.lang3.StringUtils.startsWith(authHeader,"Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        final String userToken = authHeader.substring(7);

        if (!tokenBuckets.containsKey(userToken)) {
            Bucket bucket = Bucket.builder()
                    .addLimit(Bandwidth.classic(
                            REQUEST_LIMIT, Refill.intervally(
                                    REQUEST_LIMIT,
                                    Duration.ofMinutes(EXPIRATION_CHECK_INTERVAL)))
                    )
                    .build();
            tokenBuckets.put(userToken, bucket);
        }

        Bucket bucket = tokenBuckets.get(userToken);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            filterChain.doFilter(request, response);
        } else {
            httpServletResponse.setContentType("application/json");
            httpServletResponse.getWriter().write("{\"error\": \"Too Many Requests\"}");
            httpServletResponse.setStatus(429);
        }

    }
    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
