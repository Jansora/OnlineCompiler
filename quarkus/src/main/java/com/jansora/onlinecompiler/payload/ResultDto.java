package com.jansora.onlinecompiler.payload;

import com.jansora.onlinecompiler.exception.BaseAppException;

import java.io.Serializable;
import java.util.Objects;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 12:12:14
 */
public class ResultDto implements Serializable {

    public ResultDto() {

    }

    public boolean isStatus() {
        return this.status;
    }

    public String getData() {
        return this.data;
    }

    public String getErrorCode() {
        return this.errorCode;
    }

    public String getErrorDesc() {
        return this.errorDesc;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public void setData(String data) {
        this.data = data;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public void setErrorDesc(String errorDesc) {
        this.errorDesc = errorDesc;
    }

    /*
        default true.
        if error has reached, Assign false and give reason on this.errorCode && this.errorDesc
     */
    private boolean status = true;

    /*
        data should be assigned when status is true;
     */
    private String data = null;

    public enum Status {
        SUCCESS, FAILED
    }

    /*
     errorCode should be assigned when status is false;
     */
    private String errorCode;

    /*
     errorDesc  should be assigned when status is false;
     */
    private String errorDesc;

    public ResultDto(Status status, String data, String errorCode, String errorDesc, BaseAppException e) {
        this.setStatus(Status.SUCCESS.equals(status));
        this.data = data;
        this.setErrorCode(errorCode);
        this.setErrorDesc(errorDesc);
        if(Objects.nonNull(e)) {
            this.setErrorCode(e.getErrorCode());
            this.setErrorDesc(e.getErrorDesc());
        }
    }
    /**
     * <Description> 成功的构造函数 <br>
     *
     * @author zhang.yangyuan  2020/11/26 18:17:12 <br>
     * @param data 返回数据
     */
    public ResultDto(String data) {
        this(Status.SUCCESS, data, null, null, null);
    }
    /**
     * <Description> 失败 <br>
     *
     * @author zhang.yangyuan  2020/11/26 18:17:12 <br>
     * @param errorCode 错误编码
     * @param errorDesc 错误注释
     */
    public static  ResultDto FAIL (String errorCode, String errorDesc) {
        return new ResultDto(Status.FAILED, null, errorCode, errorDesc, null);
    }
    /**
     * <Description> 失败 <br>
     *
     * @author zhang.yangyuan  2020/11/26 18:17:12 <br>
     * @param e BaseException
     */
    public ResultDto(BaseAppException e) {
        this.setStatus(false);
        this.setErrorCode(e.getErrorCode());
        this.setErrorDesc(e.getErrorDesc());
    }
    public static  ResultDto FAIL (BaseAppException e) {
        return new ResultDto(Status.FAILED, null, null, null, e);
    }
    /**
     * <Description> 成功的构造函数 <br>
     *
     * @author zhang.yangyuan  2020/11/26 18:17:12 <br>
     */
    public static  ResultDto SUCCESS () {
        return new ResultDto(Status.SUCCESS, null, null, null, null);
    }
    /**
     * <Description> 成功的构造函数 <br>
     *
     * @author zhang.yangyuan  2020/11/26 18:17:12 <br>
     */
    public static  ResultDto SUCCESS (String data) {
        return new ResultDto(Status.SUCCESS, data, null, null, null);
    }


}

