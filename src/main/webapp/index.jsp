<%@ page import="org.example.models.ResultPoint" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Lab 2</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

<header>
    <div class="name-and-group">
        Кайгородова Александра Андреевна
        <br>
        Группа P3213
    </div>

    <div class="title-and-variant">
        <div class="title">
            Лабораторная №2
        </div>
        <div class="variant">
            Вариант 1739
        </div>
    </div>
</header>

<main>
    <div class="coords-and-inputs-container">
        <div class="inputs">
            <form id="coords-form" method="POST" action="controller" target="hiddenFrame">
                <div class="x-input">
                    <h4>Выберите X</h4>
                    <div class="x-buttons">
                        <%
                            String[] xValues = {"-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3"};
                            String selectedX = request.getParameter("x");
                            for (String xVal : xValues) {
                                String active = xVal.equals(selectedX) ? "active" : "";
                        %>
                        <button type="button" class="x-button <%= active %>" data-value="<%= xVal %>">
                            <%= xVal %>
                        </button>
                        <% } %>
                        <input type="hidden" id="hiddenX" name="x" value="<%= selectedX != null ? selectedX : "" %>" required>
                    </div>
                    <span class="validation-hint" id="x-error"></span>
                </div>

                <div class="y-input">
                    <h4>Введите Y</h4>
                    <label>
                        <%
                            String yValue = request.getParameter("y");
                            if (yValue == null) yValue = "";
                        %>
                        <input id="yInput" type="text" name="y" value="<%= yValue %>"
                               placeholder="от -5 до 5" required>
                    </label>
                    <span class="validation-hint" id="y-error"></span>
                </div>

                <div class="r-input">
                    <h4>Введите R</h4>
                    <label>
                        <%
                            String rValue = request.getParameter("r");
                            if (rValue == null && session.getAttribute("lastR") != null) {
                                rValue = session.getAttribute("lastR").toString();
                            }
                            if (rValue == null) rValue = "";
                        %>
                        <input id="rInput" type="text" name="r" value="<%= rValue %>"
                               placeholder="от 1 до 4" required>
                    </label>
                    <span class="validation-hint" id="r-error"></span>
                </div>

                <div class="form-buttons-container">
                    <button type="submit" id="submitButton">Проверить точку</button>
                    <button type="button" id="showTableBtn">Показать таблицу</button>
                </div>
            </form>
        </div>
        <div class="coordinate-plane">
            <h4>Область попадания</h4>
            <canvas id="coordinate-plane" width="400" height="400"></canvas>
            <div id="graph-message" style="display:none; color:red; margin-top:10px;">
                Сначала введите радиус R!
            </div>
        </div>

    </div>

</main>
<form id="graph-form" method="POST" action="controller" style="display:none;">
    <input type="hidden" id="graph-x" name="x_graph">
    <input type="hidden" id="graph-y" name="y_graph">
    <input type="hidden" id="graph-r" name="r">
</form>


<script>
    window.pointsHistory = [
        <%
        List<ResultPoint> results = (List<ResultPoint>) session.getAttribute("results");
        if (results != null && !results.isEmpty()) {
            for (int i = 0; i < results.size(); i++) {
                ResultPoint point = results.get(i);
        %>
        {
            x: <%= point.getX() %>,
            y: <%= point.getY() %>,
            r: <%= point.getR() %>,
            hit: <%= point.isHit() %>
        }<%= i < results.size() - 1 ? "," : "" %>
        <%
            }
        }
        %>
    ];

    window.currentR = <%= session.getAttribute("lastR") != null ?
                        session.getAttribute("lastR") : "2" %>;
</script>

<footer>
    <small>DJ Шуня Enterprise. All Rights Reserved.</small>
</footer>

<script src="js/graph.js"></script>
<script src="js/mainscript.js"></script>
</body>
</html>
