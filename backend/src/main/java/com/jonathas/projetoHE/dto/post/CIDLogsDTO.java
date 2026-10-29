package com.jonathas.projetoHE.dto.post;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CIDLogsDTO(
        @JsonProperty("object_changes") List<ObjectChange> objectChanges,
        @JsonProperty("device_id") Long deviceId) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ObjectChange(String object, String type, Map<String, Object> values) {

        @JsonIgnore
        public boolean isNovoAccessLog() {
            return "access_logs".equals(object) && "inserted".equals(type);
        }

        @JsonIgnore
        public Long userId() {
            Object v = values == null ? null : values.get("user_id");
            return v == null ? null : Long.valueOf(v.toString());
        }
    }
}