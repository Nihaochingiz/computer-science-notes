# Web Development Linux Commands Cheatsheet

## 📁 Файловая система

### Создание
```bash
# Создать папку
mkdir folder_name

# Создать несколько папок
mkdir folder1 folder2 folder3

# Создать вложенные папки
mkdir -p parent/child/grandchild

# Создать пустой файл
touch filename.txt
touch index.html style.css script.js
```

### Удаление
```bash
# Удалить файл
rm filename.txt

# Удалить папку (рекурсивно)
rm -r folder_name

# Удалить папку (принудительно, без подтверждения)
rm -rf folder_name

# Удалить все файлы с определенным расширением
rm *.log
```

### Навигация
```bash
# Показать текущую папку
pwd

# Перейти в папку
cd folder_name

# Перейти на уровень выше
cd ..

# Перейти в домашнюю директорию
cd ~

# Перейти в предыдущую папку
cd -

# Показать содержимое папки
ls
ls -la        # подробный список с скрытыми файлами
ls -lh        # человеко-читаемые размеры
```

## 📋 Работа с файлами

### Копирование и перемещение
```bash
# Копировать файл
cp source.txt destination.txt

# Копировать папку рекурсивно
cp -r source_folder destination_folder

# Переместить/переименовать файл
mv old_name.txt new_name.txt

# Переместить файл в другую папку
mv file.txt /path/to/destination/
```

### Просмотр и редактирование
```bash
# Просмотреть содержимое файла
cat file.txt

# Просмотреть с нумерацией строк
cat -n file.txt

# Постраничный просмотр
less file.txt

# Редактировать файл (nano/vim)
nano file.txt
vim file.txt
```

## 🌐 Сетевые команды

### Проверка сети
```bash
# Проверить доступность сайта
ping google.com

# Показать сетевые соединения
netstat -tulpn

# Проверить порт
nc -zv localhost 3000

# Получить IP адрес
curl ifconfig.me
```

### Загрузки
```bash
# Скачать файл
wget https://example.com/file.zip

# Скачать с другим именем
wget -O new_name.zip https://example.com/file.zip

# Скачать через curl
curl -O https://example.com/file.zip
```

## 🛠️ Процессы и мониторинг

### Управление процессами
```bash
# Показать запущенные процессы
ps aux

# Поиск процесса
ps aux | grep node

# Завершить процесс
kill PID
kill -9 PID    # принудительное завершение

# Показать использование ресурсов
htop
top
```


## 📦 Пакетные менеджеры

### Ubuntu/Debian (apt)
```bash
# Обновить список пакетов
sudo apt update

# Установить пакет
sudo apt install package_name




## 🔧 Права доступа

### Изменение прав
```bash
# Дать права на выполнение
chmod +x script.sh

# Дать полные права владельцу
chmod 755 file.txt

# Сменить владельца файла
chown user:group file.txt

# Рекурсивно сменить права для папки
chmod -R 755 folder_name
```

## 🌐 Веб-серверы

### Nginx
```bash
# Запуск/остановка
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить конфигурацию
sudo nginx -s reload
```

### Apache
```bash
# Запуск/остановка
sudo systemctl start apache2
sudo systemctl stop apache2

# Перезапуск
sudo systemctl restart apache2
```

## 🐳 Docker

### Основные команды
```bash
# Запустить контейнер
docker run -d -p 80:80 nginx

# Показать запущенные контейнеры
docker ps

# Остановить контейнер
docker stop container_id

# Показать логи
docker logs container_id

# Собрать образ
docker build -t myapp .
```

## 🔍 Поиск

### Поиск файлов
```bash
# Найти файл по имени
find /path -name "filename.txt"

# Найти файлы по расширению
find . -name "*.js"

# Найти файлы измененные за последние 7 дней
find . -mtime -7

# Поиск в содержимом файлов
grep "search_text" file.txt
grep -r "search_text" folder_name/
```


## 💡 Полезные сочетания

### Терминал
```bash
# Очистить терминал
clear
Ctrl + L

# Прервать выполнение
Ctrl + C

# Завершить ввод
Ctrl + D

# Поиск в истории команд
Ctrl + R
```


---

*Сохраните этот cheatsheet для быстрого доступа к часто используемым командам!* 🚀
