package com.duan.server.Validators;


import java.util.regex.Pattern;


public class ValidateEmail {
    //Gmail Special Case for Emails
    public static boolean validateEmail(String email){
        String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9\\+_-]+(\\.[A-Za-z0-9\\+_-]+)*@"
                + "[^-][A-Za-z0-9\\+-]+(\\.[A-Za-z0-9\\+-]+)*(\\.[A-Za-z]{2,})$";
        return patternMatches(email,regexPattern);
    }
    public static boolean patternMatches(String emailAddress, String regexPattern) {
        return Pattern.compile(regexPattern,Pattern.CASE_INSENSITIVE)
                .matcher(emailAddress)
                .matches();
    }
}
