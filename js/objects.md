Что такое деструктуризация объектов в **JavaScript**?

**Деструктуризация объектов** (destructuring assignment) — это синтаксическая возможность JavaScript, которая позволяет извлекать свойства из объектов и присваивать их переменным в одной краткой операции.
```js
const user = {
  name: 'Анна',
  age: 25,
  city: 'Москва'
};

// Без деструктуризации
const name = user.name;
const age = user.age;

// С деструктуризацией
const { name, age } = user;
console.log(name); // 'Анна'
console.log(age);  // 25
```

**Дескрипторы свойств** в **JavaScript** — это объекты, которые описывают свойства объекта и определяют их поведение при взаимодействии с ними. Каждое свойство объекта содержит свой собственный дескриптор, который содержит несколько свойств или атрибутов, определяющих характеристики свойства.



https://github.com/1neye/javascript_interview_cheatsheet


Вот краткий конспект по объектам в JavaScript в формате Markdown.

---

# 3 Объекты в JavaScript

## 3.1 О Модуле
Этот модуль посвящен подробному изучению объектов — фундаментальной структуры данных в JavaScript. Мы рассмотрим, как их создавать, изменять, настраивать и эффективно использовать.

## 3.2 Основы объектов
Объект — это неупорядоченная коллекция свойств (ключ: значение). Ключи — это строки (или Symbols), значения могут быть любого типа, включая функции (методы).

```javascript
// Создание объекта (литерал)
let user = {
  name: 'Alice',          // Свойство
  age: 30,                // Свойство
  sayHello: function() {  // Метод
    console.log('Привет!');
  }
};

// Доступ к свойствам
console.log(user.name);    // Alice (точечная нотация)
console.log(user['age']);  // 30 (скобочная нотация)

// Добавление/изменение свойства
user.city = 'Moscow';
user['age'] = 31;
```

## 3.3 Ключевое слово `this`
`this` — это контекст выполнения функции. Внутри метода объекта `this` обычно ссылается на сам объект (если функция не стрелочная).

```javascript
let user = {
  name: 'Bob',
  greet: function() {
    console.log(`Привет, я ${this.name}`);
  }
};
user.greet(); // Привет, я Bob

// Стрелочная функция не имеет своего this
let user2 = {
  name: 'Charlie',
  greet: () => {
    console.log(`Привет, я ${this.name}`); // this будет взят из внешней области (глобальный объект)
  }
};
user2.greet(); // Привет, я undefined (в строгом режиме)
```

## 3.4 Опциональная цепочка
Оператор `?.` позволяет безопасно обращаться к вложенным свойствам, не проверяя существование каждого промежуточного.

```javascript
let user = {
  name: 'David',
  address: null // или свойство может отсутствовать
};

// Обычный доступ вызовет ошибку, если address не объект
// console.log(user.address.city); // TypeError!

// Опциональная цепочка
console.log(user.address?.city);   // undefined (ошибки нет)
console.log(user.profile?.age);    // undefined (profile не существует)
console.log(user.say?.());         // undefined (метод не вызывается, если его нет)
```

## 3.5 Распространение (Spread-оператор)
Оператор `...` (spread) "разворачивает" свойства одного объекта в другой. Используется для создания копий и слияния.

```javascript
let defaults = { theme: 'light', showNotifications: true };
let userSettings = { theme: 'dark' };

// Слияние (порядок важен: более поздние перезаписывают ранние)
let finalSettings = { ...defaults, ...userSettings };
console.log(finalSettings); // { theme: 'dark', showNotifications: true }

// Создание неглубокой копии
let copy = { ...finalSettings };
```

## 3.6 Глубокое копирование
Spread-оператор (`...`) и `Object.assign()` создают **неглубокие** копии. Вложенные объекты копируются по ссылке. Для глубокого копирования (со всеми уровнями вложенности) нужно использовать другие методы.

```javascript
let original = {
  name: 'Eve',
  address: { city: 'London', street: 'Baker' }
};

// Неглубокое копирование
let shallowCopy = { ...original };
shallowCopy.address.city = 'New York';
console.log(original.address.city); // New York (оригинал тоже изменился!)

// Глубокое копирование
let deepCopy = JSON.parse(JSON.stringify(original));
// Или использовать структурное клонирование:
// let deepCopy = structuredClone(original);

deepCopy.address.city = 'Paris';
console.log(original.address.city); // New York (оригинал не изменился)
```

## 3.7 Деструктуризация
Синтаксис, позволяющий извлекать свойства объекта в отдельные переменные.

```javascript
let user = { id: 1, name: 'Frank', age: 25 };

// Базовая деструктуризация
let { name, age } = user;
console.log(name); // Frank
console.log(age);  // 25

// Присвоение переменной с другим именем
let { name: userName, id } = user;
console.log(userName); // Frank

// Значения по умолчанию
let { city = 'Не указан' } = user;
console.log(city); // Не указан
```

## 3.8 Динамическое определение свойств
Свойства объекта можно создавать динамически, используя выражение в квадратных скобках `[]` при создании объекта.

```javascript
let key = 'favoriteColor';
let value = 'blue';

let user = {
  name: 'Grace',
  [key]: value // Вычисляемое свойство
};

console.log(user.favoriteColor); // blue

// Динамическое обновление
let dynamicKey = 'age';
user[dynamicKey] = 28;
console.log(user.age); // 28
```

## 3.9 Дескрипторы свойств
Каждое свойство объекта имеет атрибуты (флаги), которые можно настроить с помощью `Object.defineProperty`.

- `value` — значение свойства.
- `writable` — можно ли изменять значение (`false` — свойство только для чтения).
- `enumerable` — будет ли свойство видно в циклах (`for...in`) и методах типа `Object.keys()`.
- `configurable` — можно ли удалять свойство и изменять его дескрипторы.

```javascript
let user = {};

Object.defineProperty(user, 'id', {
  value: 12345,
  writable: false, // Нельзя изменить
  enumerable: false, // Не будет появляться в циклах
  configurable: false // Нельзя удалить или перенастроить
});

user.id = 999; // Не сработает (в строгом режиме ошибка)
console.log(user.id); // 12345

for (let key in user) {
  console.log(key); // Ничего не выведет, так как enumerable: false
}
```

## 3.10 Характеристики объектов
Сам объект тоже может быть "запечатан" или "заморожен" с помощью статических методов.

- `Object.preventExtensions(obj)` — запрещает добавлять новые свойства.
- `Object.seal(obj)` — запрещает добавлять/удалять свойства, все существующие становятся `configurable: false`.
- `Object.freeze(obj)` — полностью замораживает объект: запрещает добавлять, удалять, изменять существующие свойства (делает их `writable: false` и `configurable: false`). **Внимание: работает неглубоко.**

```javascript
let user = { name: 'Henry', age: 30 };
Object.freeze(user);

user.name = 'John'; // Не сработает (в строгом режиме ошибка)
user.city = 'NYC';  // Не добавится
delete user.age;    // Не удалится
console.log(user); // { name: 'Henry', age: 30 }
```

## 3.11 Мутация объектов
Объекты в JS хранятся и передаются **по ссылке**. Присваивание объекта новой переменной не создает его копию, а создает еще одну ссылку на тот же объект.

```javascript
let user1 = { name: 'Ivy' };
let user2 = user1; // Копирование ссылки

user2.name = 'Julia';

console.log(user1.name); // Julia (изменения видны по обеим ссылкам)
console.log(user1 === user2); // true (это один и тот же объект в памяти)

// Чтобы создать новый объект, используют spread или Object.assign
let user3 = { ...user1 };
console.log(user1 === user3); // false (это разные объекты)
```

## 3.12 Прототипы объектов
Это механизм наследования в JavaScript. Каждый объект имеет скрытую ссылку (`[[Prototype]]`) на другой объект (свой прототип). При обращении к свойству, если его нет в объекте, поиск продолжается в прототипе.

```javascript
let animal = {
  eats: true,
  walk() {
    console.log('Животное идет');
  }
};

let rabbit = {
  jumps: true,
  __proto__: animal // Устанавливаем прототип (устаревший способ, но наглядный)
};

// Свойство нашлось в rabbit
console.log(rabbit.jumps); // true

// Свойства нет в rabbit, ищется в прототипе animal
console.log(rabbit.eats); // true
rabbit.walk(); // Животное идет

// Современный способ работы с прототипами:
// Object.create(), Object.getPrototypeOf(), Object.setPrototypeOf()
```
