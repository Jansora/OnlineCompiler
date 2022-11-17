package com.jansora.onlinecompiler.payload;

import java.io.Serializable;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 18:25:10
 */
public class ShareReq implements Serializable {

    /**
     * 语言
     */
    String language;


    /**
     * share
     */
    String share;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getShare() {
        return share;
    }

    public void setShare(String share) {
        this.share = share;
    }

    @Override
    public String toString() {
        return "ShareReq{" +
                "language='" + language + '\'' +
                ", share='" + share + '\'' +
                '}';
    }
}
