package com.jansora.onlinecompiler.exception.dao;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.exception.BaseAppException;

public class DataLogicErrorException extends BaseAppException {
    public DataLogicErrorException() {
        super("500", "数据库逻辑错误，请检查");
    }
    public DataLogicErrorException(String errorDesc) {
        super("500", errorDesc);
    }
}
