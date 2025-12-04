<%@ page import="org.example.models.ResultPoint" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Результаты | Web Lab 2</title>
    <link rel="stylesheet" href="css/styles.css">
    <style>
        .results-container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px;
        }

        h2 {
            text-align: center;
            color: #034742;
            margin: 40px 0;
            font-size: 32px;
        }

        .actions {
            text-align: center;
            margin-top: 40px;
        }


        .res-table {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            text-align: center;
            border: 3px solid black;
            border-radius: 10px;
            font-size: 18px;
        }

        .res-table th, .res-table td {
            border: 1px solid black;
            padding: 15px 20px;
            text-align: center;
            font-size: 16px;
        }

    </style>
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
    <div class="results-container">
        <h2>Результаты проверки попаданий</h2>

        <table class="res-table">
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Текущее время</th>
                <th>Время исполнения (ms)</th>
                <th>Результат</th>
            </tr>
            </thead>
            <tbody>
            <%
                List<ResultPoint> results = (List<ResultPoint>) session.getAttribute("results");
                if (results != null && !results.isEmpty()) {
                    for (ResultPoint point : results) {
            %>
            <tr class="<%= point.isHit() ? "hit" : "miss" %>">
                <td><%= point.getX() %></td>
                <td><%= point.getY() %></td>
                <td><%= point.getR() %></td>
                <td><%= point.getTimestamp() %></td>
                <td><%= point.getExecutionTimeMs() %></td>
                <td><%= point.isHit() ? "Попадание" : "Промах" %></td>
            </tr>
            <%
                }
            } else {
            %>
            <tr>
                <td colspan="6" style="text-align: center;">Нет данных для отображения</td>
            </tr>
            <% } %>
            </tbody>
        </table>

        <div class="actions" style="text-align: center;margin-top: 20px;white-space: nowrap;">
            <a href="controller" class="back-button">Вернуться к форме</a>
            <a href="controller?clear=true" class="clear-button">Очистить историю</a>
        </div>

    </div>
</main>

<footer>
    <small>DJ Shunya Enterprise. All Rights Reserved.</small>
</footer>
</body>
</html>
