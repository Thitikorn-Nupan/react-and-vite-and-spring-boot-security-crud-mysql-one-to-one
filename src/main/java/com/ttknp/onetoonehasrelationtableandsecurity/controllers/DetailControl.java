package com.ttknp.onetoonehasrelationtableandsecurity.controllers;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Detail;
import com.ttknp.onetoonehasrelationtableandsecurity.services.DetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/detail")
public class DetailControl {

    private final DetailService detailService;

    @Autowired
    public DetailControl( DetailService detailService) {
        this.detailService = detailService;
    }

    @GetMapping(value = "/reads")
    private ResponseEntity<Iterable<Detail>> reads() {
        return ResponseEntity
                .status(200)
                .body(detailService.getDetails());
    }

    @GetMapping(value = "/read")
    private ResponseEntity<Detail> read(@RequestParam long did) {
        return ResponseEntity
                .status(200)
                .body(detailService.getDetail(did));
    }


    @PutMapping(value = "/update")
    private ResponseEntity<Boolean> update(@RequestBody Detail detail, @RequestParam long did) {
        return ResponseEntity
                .status(202)
                .body(detailService.updateDetail(detail,did));
    }


}
