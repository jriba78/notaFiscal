package com.notafiscal.nota;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class NotaFiscalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void geraNotaComDadosObrigatorios() throws Exception {
        String corpo = objectMapper.writeValueAsString(Map.of(
                "emitenteRazaoSocial", "Aurora Serviços Ltda",
                "emitenteCnpj", "11.222.333/0001-81",
                "clienteNome", "Marina Costa",
                "clienteDocumento", "529.982.247-25",
                "descricao", "Consultoria financeira de setembro",
                "valor", 1500.50,
                "dataEmissao", "2026-09-29"
        ));

        mockMvc.perform(post("/api/notas-fiscais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numero").value(startsWith("2026")))
                .andExpect(jsonPath("$.emitenteCnpj").value("11.222.333/0001-81"))
                .andExpect(jsonPath("$.clienteDocumento").value("529.982.247-25"))
                .andExpect(jsonPath("$.valor").value(1500.50));

        mockMvc.perform(get("/api/notas-fiscais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descricao").value("Consultoria financeira de setembro"));
    }

    @Test
    void rejeitaCnpjInvalido() throws Exception {
        String corpo = objectMapper.writeValueAsString(Map.of(
                "emitenteRazaoSocial", "Aurora Serviços Ltda",
                "emitenteCnpj", "11.222.333/0001-80",
                "clienteNome", "Marina Costa",
                "clienteDocumento", "529.982.247-25",
                "descricao", "Consultoria",
                "valor", 10,
                "dataEmissao", "2026-09-29"
        ));

        mockMvc.perform(post("/api/notas-fiscais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.emitenteCnpj").value("CNPJ do emitente inválido"));
    }
}
