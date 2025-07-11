# HTTPS

# HTTP(S) — протокол передачи гипертекста

HTTP является основой интернета и используется для загрузки веб-страниц с использованием гипертекстовых ссылок. Относится к прикладным протоколам и работает поверх других уровней стека сетевых протоколов.

Обычно принцип передачи данных по протоколу HTTP включает в себя компьютер клиента (например, ваш ПК), отправляющий запрос на сервер, который затем возвращает ответ. Каждый HTTP-запрос включает в себя ряд закодированных данных, содержащих различную информацию, в том числе:

- версию HTTP,
- URL-адрес,
- метод HTTP-запроса — указание на ожидание запроса от сервера (например, PUT- и GET-запросы),
- заголовок — он передает основную информацию о запросе и содержит пары ключ-значение,
- тело запроса (опционально, это любая отправляющаяся информация).

После получения запроса сервер должен дать ответ. В его стандартную структуру входят: код состояния, заголовок и тело ответа.

Код состояния HTTP-запроса — это трехзначные коды, которые, как правило, указывают на успешность его выполнения. Они разбиваются на пять основных блоков:

1. 1xx* Информация (Informational),
2. 2хх Успешность выполнения (Success),
3. 3хх Перенаправление (Redirection),
4. 4xx Ошибка клиента (Client Error),
5. 5xx Ошибка сервера (Server Error),
- ХХ обозначают цифры от 00 до 99.

Аналогично запросу, ответ имеет заголовок, который содержит различную информацию — например, язык отправляемых данных. В большинстве случаев там содержатся HTML-данные, которые веб-браузер клиента преобразует в страницу.

При разговоре про HTTP нельзя не упомянуть важный аспект — незащищенность протокола. При передаче данных все происходит открыто, в результате чего злоумышленник может перехватить данные. Для исключения этой проблемы был разработан протокол HTTPS.