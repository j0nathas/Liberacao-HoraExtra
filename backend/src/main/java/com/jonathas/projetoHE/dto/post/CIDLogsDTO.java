
package com.jonathas.projetoHE.dto.post;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CIDLogsDTO(
        @JsonProperty("object_changes") List<ObjectChange> objectChanges,
        @JsonProperty("device_id") Long deviceId
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ObjectChange(
            String object,
            String type,
            Map<String, Object> values
    ) {

        public boolean isNovoAccessLog() {
            return "access_logs".equals(object) && "inserted".equals(type);
        }

        public Long id() {
            return getValue("id");
        }

        public Long userId() {
            return getValue("user_id");
        }

        public Long deviceId() {
            return getValue("device_id");
        }

        private Long getValue(String key) {
            if (values == null) {
                return null;
            }
            Object raw = values.get(key);
            if (raw == null) {
                return null;
            }
            String texto = raw.toString().trim();
            if (texto.isEmpty()) {
                return null;
            }
            try {
                return Long.valueOf(texto);
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }
}
