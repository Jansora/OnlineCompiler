package com.jansora.onlinecompiler.payload;

import java.io.Serializable;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 14:42:24
 */
public class CodeReq implements Serializable {
    /**
     * code
     */
    String code;

    /**
     * 语言
     */
    String language;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }


    @Override
    public String toString() {
        return "CodeReq{" +
                "code='" + code + '\'' +
                ", language='" + language + '\'' +
                '}';
    }
}
