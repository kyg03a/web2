package org.example.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import org.example.models.ResultPoint;
import org.example.utils.AreaHitChecker;

@WebServlet("/areaCheck")
public class AreaCheckServlet extends HttpServlet {
    private static final Pattern NUMBER_PATTERN = Pattern.compile("-?\\d+(\\.\\d{1,3})?");
    private static final Pattern INTEGER_PATTERN = Pattern.compile("-?\\d+");
    private static final Pattern R_PATTERN = Pattern.compile("[1-4](\\.\\d{1,3})?");

    public AreaCheckServlet() {
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        long startTime = System.nanoTime();

        try {
            String xStr = request.getParameter("x_graph");
            boolean fromGraph = false;
            if (xStr != null && !xStr.isEmpty()) {
                fromGraph = true;
            } else {
                xStr = request.getParameter("x");
                fromGraph = false;
            }
            System.out.println("DEBUG: x_graph = " + request.getParameter("x_graph"));
            System.out.println("DEBUG: x = " + request.getParameter("x"));
            String yStr = request.getParameter("y");
            String rStr = request.getParameter("r");
            if (xStr == null || yStr == null || rStr == null) {
                response.sendError(400, "Отсутствуют обязательные параметры");
                return;
            }

            if (xStr.isEmpty() || yStr.isEmpty() || rStr.isEmpty()) {
                response.sendError(400, "Параметры не могут быть пустыми");
                return;
            }

            if (!this.isValidNumber(xStr, fromGraph)) {
                response.sendError(400, "Неверный формат координаты X. " + (fromGraph ? "Допустимы числа от -5 до 3 с точностью до 3 знаков" : "Допустимы целые числа от -5 до 3"));
                return;
            }

            if (!this.isValidNumber(yStr, true)) {
                response.sendError(400, "Неверный формат координаты Y. Допустимы числа от -5 до 5 с точностью до 3 знаков");
                return;
            }

            if (!this.isValidR(rStr)) {
                response.sendError(400, "Неверный формат радиуса R. Допустимы числа от 1 до 4 с точностью до 3 знаков");
                return;
            }

            double x = Double.parseDouble(xStr.replace(',', '.'));
            double y = Double.parseDouble(yStr.replace(',', '.'));
            double r = Double.parseDouble(rStr.replace(',', '.'));

            if (x < -5.0 || x > 3.0) {
                response.sendError(400, "Координата X должна быть в диапазоне от -5 до 3");
                return;
            }

            if (y < -5.0 || y > 5.0) {
                response.sendError(400, "Координата Y должна быть в диапазоне от -5 до 5");
                return;
            }

            if (r < 1.0 || r > 4.0) {
                response.sendError(400, "Радиус R должен быть в диапазоне от 1 до 4");
                return;
            }

            if (fromGraph && !this.hasValidPrecision(xStr, 3)) {
                response.sendError(400, "Координата X не должна содержать более 3 знаков после запятой");
                return;
            }

            if (!this.hasValidPrecision(yStr, 3)) {
                response.sendError(400, "Координата Y не должна содержать более 3 знаков после запятой");
                return;
            }

            boolean hit = AreaHitChecker.checkHit(x, y, r);
            long executionTime = System.nanoTime() - startTime;
            ResultPoint result = new ResultPoint(x, y, r, hit, executionTime);
            this.saveResultToSession(request, result);
            HttpSession session = request.getSession();
            session.setAttribute("lastR", String.valueOf(r));
            request.getRequestDispatcher("/result.jsp").forward(request, response);

        } catch (NumberFormatException var20) {
            response.sendError(400, "Неверный числовой формат параметров");
        } catch (Exception e) {
            response.sendError(500, "Внутренняя ошибка сервера: " + e.getMessage());
        }
    }

    private boolean isValidNumber(String value, boolean allowDecimal) {
        if (value != null && !value.isEmpty()) {
            String normalizedValue = value.replace(',', '.');
            if (!NUMBER_PATTERN.matcher(normalizedValue).matches()) {
                return false;
            } else {
                return allowDecimal || INTEGER_PATTERN.matcher(normalizedValue).matches();
            }
        } else {
            return false;
        }
    }

    private boolean isValidR(String value) {
        return value != null && !value.isEmpty() ? R_PATTERN.matcher(value).matches() : false;
    }

    private boolean hasValidPrecision(String value, int maxDecimalPlaces) {
        if (value == null) {
            return false;
        } else {
            String normalizedValue = value.replace(',', '.');
            if (!normalizedValue.contains(".")) {
                return true;
            } else {
                String[] parts = normalizedValue.split("\\.");
                if (parts.length != 2) {
                    return false;
                } else {
                    return parts[1].length() <= maxDecimalPlaces;
                }
            }
        }
    }


    private void saveResultToSession(HttpServletRequest request, ResultPoint result) {
        HttpSession session = request.getSession();
        List<ResultPoint> results = (List)session.getAttribute("results");
        if (results == null) {
            results = new ArrayList();
            session.setAttribute("results", results);
        }

        results.add(0, result);
        if (results.size() > 50) {
            List<ResultPoint> var5 = new ArrayList(results.subList(0, 50));
            session.setAttribute("results", var5);
        }

    }
}
