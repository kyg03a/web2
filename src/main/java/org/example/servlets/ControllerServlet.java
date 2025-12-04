package org.example.servlets; // исправь опечатку "sevlets" → "servlets"

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("true".equals(request.getParameter("showResults"))) {
            request.getRequestDispatcher("/result.jsp").forward(request, response);
            return;
        }

        if ("true".equals(request.getParameter("clear"))) {
            request.getSession().removeAttribute("results");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }
        String x = getCoordinate(request, "x_graph", "x");
        String y = getCoordinate(request, "y_graph", "y");
        String r = request.getParameter("r");

        boolean hasAllParams = (x != null && !x.isEmpty()) &&
                (y != null && !y.isEmpty()) &&
                (r != null && !r.isEmpty());

        if (hasAllParams) {
            request.getRequestDispatcher("/areaCheck").forward(request, response);
        } else {
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
    private String getCoordinate(HttpServletRequest request, String graphParam, String formParam) {
        String graphValue = request.getParameter(graphParam);
        if (graphValue != null && !graphValue.isEmpty()) {
            return graphValue;
        }
        return request.getParameter(formParam);
    }
}