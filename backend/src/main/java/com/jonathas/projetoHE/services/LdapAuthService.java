package com.jonathas.projetoHE.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.naming.Context;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;

@Service
public class LdapAuthService {

    @Value("${ad.url}")
    private String ldapUrl;

    @Value("${ad.domain}")
    private String adDomain;

    public boolean authenticate(String username, String password) {
        String userPrincipalName = username.contains("@") ? username : username + "@" + adDomain;

        Hashtable<String, String> env = new Hashtable<>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, ldapUrl);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, userPrincipalName);
        env.put(Context.SECURITY_CREDENTIALS, password);

        try {
            DirContext ctx = new InitialDirContext(env);
            ctx.close();
            return true;
        } catch (Exception e) {
            System.out.println("Falha na autenticação AD para: " + username + " - Erro: " + e.getMessage());
            return false;
        }
    }
}
