package com.duan.server.Configurations;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary getCloudinary(){
        Map config = new HashMap();
        config.put("cloud_name", "dt7a2rxcl");
        config.put("api_key", "995391728793551");
        config.put("api_secret", "oSCtRLFG6drztsuZ2d6HdbqFb34");
        config.put("secure", true);
        return new Cloudinary(config);
    }

}
