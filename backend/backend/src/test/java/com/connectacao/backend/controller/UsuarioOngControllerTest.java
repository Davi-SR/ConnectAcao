package com.connectacao.backend.controller;

import com.connectacao.backend.dto.usuarioong.MembroOngResponse;
import com.connectacao.backend.dto.usuarioong.UsuarioOngCreateRequest;
import com.connectacao.backend.entidade.PapelOng;
import com.connectacao.backend.service.UsuarioOngService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UsuarioOngControllerTest {
    private UsuarioOngService usuarioOngService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        usuarioOngService = mock(UsuarioOngService.class);
        when(usuarioOngService.adicionarMembro(eq(1L), eq(2L), nullable(UsuarioOngCreateRequest.class)))
                .thenAnswer(invocation -> {
                    UsuarioOngCreateRequest request = invocation.getArgument(2);
                    PapelOng papel = request == null || request.getPapel() == null
                            ? PapelOng.MEMBRO : request.getPapel();
                    return resposta(papel);
                });
        mockMvc = MockMvcBuilders.standaloneSetup(new UsuarioOngController(usuarioOngService)).build();
    }

    @Test
    void postSemBodyCriaComoMembro() throws Exception {
        mockMvc.perform(post("/ongs/1/membros/2"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.papel").value("MEMBRO"));
    }

    @Test
    void postComObjetoVazioCriaComoMembro() throws Exception {
        mockMvc.perform(post("/ongs/1/membros/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.papel").value("MEMBRO"));
    }

    @Test
    void postComAdminPreservaPapel() throws Exception {
        mockMvc.perform(post("/ongs/1/membros/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"papel\":\"ADMIN\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.papel").value("ADMIN"));
    }

    private MembroOngResponse resposta(PapelOng papel) {
        return new MembroOngResponse(2L, "Maria", "maria@example.com", null,
                papel, LocalDateTime.of(2026, 1, 1, 10, 0));
    }
}