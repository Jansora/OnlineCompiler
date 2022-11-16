package com.jansora.onlinecompiler.exception.dao;

import com.jansora.onlinecompiler.exception.BaseAppException;

/**
 * <Description> <br>
 *
 * @author zhang.yangyuan (jansora)
 * 2020/12/02 15:47:59
 */
public class DataNotFoundException extends BaseAppException {
    public DataNotFoundException() {
        super("404", "未找到该资源");
    }
    public DataNotFoundException(String errorDesc) {
        super("404", errorDesc);
    }
}
