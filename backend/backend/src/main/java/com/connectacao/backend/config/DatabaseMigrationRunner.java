package com.connectacao.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrationRunner.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN foto_url TYPE TEXT");
            log.info("Migração de esquema executada com sucesso: foto_url alterada para TEXT");
        } catch (Exception e) {
            log.debug("Aviso durante migração da coluna foto_url: {}", e.getMessage());
        }
    }
}
