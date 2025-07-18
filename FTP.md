# FTP

# FTP — протокол передачи данных в сети

FTP — это клиент-серверный протокол, который использует два канала для передачи данных: командный, управляющий процессом передачи, и транспортный, непосредственно передающий информацию. Для FTP-протокола устройство конечного пользователя называется локальным хостом, а второй компьютер — удаленным хостом, играющим роль сервера. Для работы протокола требуется его правильная настройка со стороны хоста и специальный клиент на локальном хосте.

# Описание работы протокола в сети Интернет

Пользователю нужно войти на FTP-сервер. Здесь нужно учитывать, что некоторые серверы разрешают доступ к части или всем своим данным без авторизации. Это называется «анонимным FTP». При этом файлы с сервера можно будет только передавать на компьютер клиента.

Далее клиент начинает диалог с сервером — запрашивает разрешение на изменение файлов на сервере. Использую авторизованный FTP-клиент, можно скачивать файлы с сервера, отгружать их на него и выполнять другие манипуляции.

FTP-сессии работают в двух режимах — активном и пассивном:

- При активном режиме сервер после инициализации, путем вызова командного канала, открывает транспортный канал и начинает передачу данных.
- При пассивном режиме сервер при помощи командного канала отправляет клиенту данные, требующиеся для открытия канала передачи данных.

Из-за того, что клиент создает все подключения в пассивном режиме, этот протокол хорошо подходит для работы с брандмауэрами.