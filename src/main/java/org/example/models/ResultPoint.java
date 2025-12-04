package org.example.models;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ResultPoint {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private LocalDateTime timestamp;
    private long executionTime;

    public ResultPoint(double x, double y, double r, boolean hit, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.timestamp = LocalDateTime.now();
        this.executionTime = executionTime;
    }
    public double getX() {
        return this.x;
    }

    public double getY() {
        return this.y;
    }

    public double getR() {
        return this.r;
    }

    public boolean isHit() {
        return this.hit;
    }

    public String getTimestamp() {
        return this.timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public double getExecutionTimeMs() {
        return this.executionTime / 1_000_000.0; // ns → ms
    }
}

