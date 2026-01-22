package com.cornelius.StudentDashboard.dto.user;

import org.apache.catalina.User;

public class UserDto {
    private Integer id;
    private String name;

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public UserDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public UserDto() { }
}
