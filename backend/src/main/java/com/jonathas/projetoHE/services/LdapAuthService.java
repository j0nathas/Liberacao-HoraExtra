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

    /**
     * Tenta autenticar o usuário diretamente no Active Directory.
     */
    public boolean authenticate(String username, String password) {
        // Formata o usuário para o padrão do AD (ex: usuario@magna.global)
        String userPrincipalName = username.contains("@") ? username : username + "@" + adDomain;

        Hashtable<String, String> env = new Hashtable<>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, ldapUrl);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, userPrincipalName);
        env.put(Context.SECURITY_CREDENTIALS, password);

        try {
            // Tenta abrir uma conexão. Se a senha estiver errada, lança exceção.
            DirContext ctx = new InitialDirContext(env);
            ctx.close();
            return true; // Autenticado com sucesso!
        } catch (Exception e) {
            // Log do erro (opcional)
            System.out.println("Falha na autenticação AD para: " + username + " - Erro: " + e.getMessage());
            return false;
        }
    }
}
