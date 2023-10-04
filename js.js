let entries = JSON.parse(localStorage.getItem('entries')) || [];

function toggleExpenseType() {
    let typeSelect = document.getElementById('type');
    let expenseTypeDiv = document.getElementById('expense-type-div');

    if (typeSelect.value === 'expense') {
        expenseTypeDiv.style.display = 'block';
    } else {
        expenseTypeDiv.style.display = 'none';
    }
}
function closeModal() {
    document.getElementById('welcomeOverlay').style.display = 'none';
}

function addEntry() {
    let type = document.getElementById('type').value;
    let amount = parseFloat(document.getElementById('amount').value);
    let date = document.getElementById('date').value;
    let expenseType = document.getElementById('expense-type').value;
    
    if (amount && date) {
        entries.push({ type, amount, date, expenseType });
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
    }
}

function displayEntries() {
    let entriesList = document.getElementById('entries');
    entriesList.innerHTML = '';
    
    entries.forEach(entry => {
        let listItem = document.createElement('li');
        listItem.textContent = `${entry.type === 'income' ? 'Надходження' : 'Витрати ' + entry.expenseType}: ${entry.amount} грн на ${entry.date}`;
        entriesList.appendChild(listItem);
    });
}

window.onload = function() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // Січень це 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("date").value = today;
}

let myChart;

function generateChart() {
    let monthFilter = document.getElementById('month-filter').value;
    let filteredEntries;

    if (monthFilter === "all-time") {
        filteredEntries = entries;
    } else {
        filteredEntries = entries.filter(entry => new Date(entry.date).getMonth() === new Date(`${monthFilter}-01`).getMonth());
    }

    let incomeTotal = filteredEntries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);

    let expenseTypes = ['Їжа', 'Одяг', 'Транспорт', 'Товари', 'Медикаменти', 'Перекази', 'Інше'];
    let expenseTotals = expenseTypes.map(type => {
        return filteredEntries.filter(e => e.type === 'expense' && e.expenseType === type).reduce((acc, curr) => acc + curr.amount, 0);
    });

    let ctx = document.getElementById('myChart').getContext('2d');

    // Знищення попередньої діаграми
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Надходження', ...expenseTypes.map(e => e.charAt(0).toUpperCase() + e.slice(1))],
            datasets: [{
                data: [incomeTotal, ...expenseTotals],
                backgroundColor: ['#50b3a2', '#ff6b6b', '#6c757d', '#007bff', '#17a2b8', '#ffc107', '#28a745', '#dc3545']
            }]
        }
    });
    if (expenseTotals.reduce((a, b) => a + b, 0) > incomeTotal) {
        showNotification();
    }
}
function clearData() {
    if (confirm("Ви впевнені, що хочете видалити всі збережені дані?")) {
        localStorage.removeItem('entries');
        entries = [];
        displayEntries();
        generateChart(); // Додатково, щоб очистити відображення діаграми, якщо вона вже була створена
        alert("Дані було успішно видалено.");
    }
}
function toggleEntries() {
    let entriesSection = document.getElementById('entriesSection');
    if (entriesSection.style.display === "none") {
        entriesSection.style.display = "block";
    } else {
        entriesSection.style.display = "none";
    }
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';

    setTimeout(closeNotification, 10000);  // автоматичне закриття через 10 секунд
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.transform = 'translateY(100%)';
    notification.style.opacity = '0';
}
const recommendations = [
    "Створіть бюджет та дотримуйтеся його.",
    "Економте не менше 10% ваших доходів.",
    "Ведіть запис усіх своїх витрат.",
    "Завжди мати запасний фонд для непередбачених витрат.",
    "Освітлюйтеся з фінансових питань.",
    "Уникайте необґрунтованих покупок.",
    "Працюйте над покращенням своєї кредитної історії.",
    "Інвестуйте в свою освіту.",
    "Розглядайте можливість інвестування коштів.",
    "Не намагайтеся збагатіти швидко.",
    "Шукайте додаткові джерела доходу.",
    "Запитуйте поради у фінансових консультантів.",
    "Вивчайте принципи дієвого боргу та уникайте поганих боргів.",
    "Частіше переглядайте свої фінансові звіти.",
    "Встановлюйте фінансові цілі.",
    "Розумійте різницю між потребами та бажаннями.",
    "Огороджуйте себе від фінансових ризиків.",
    "Завжди читайте умови договорів.",
    "Уникайте фінансових якорів — великих постійних витрат.",
    "Прагніть до фінансової незалежності.",
    "Індексуйте свої інвестиції.",
    "Вчитесь на своїх фінансових помилках.",
    "Стежте за своїми регулярними платежами.",
    "Забезпечте себе на випадок втрати джерела доходу.",
    "Зберігайте невелику суму готівки для непередбачених витрат.",
    "Користуйтеся кредитними картками обережно.",
    "Вивчайте умови кредитування перед укладанням угоди.",
    "Звертайте увагу на комісійні та приховані платежі.",
    "Намагайтеся скорочувати витрати там, де це можливо.",
    "Користуйтеся автоматичними платежами, щоб не пропускати терміни оплати.",
    "Завжди мати частину грошей в ліквідному вигляді.",
    "Заплануйте свою пенсійну стратегію заздалегідь.",
    "Вивчайте свої права як споживача та платника податків.",
    "Користуйтеся бонусними програмами та знижками обережно.",
    "Спілкуйтеся з іншими про фінансові рекомендації та діліться своїм досвідом.",
    "Намагайтеся сплачувати кредити з високими процентними ставками якнайшвидше.",
    "Завжди мати запасний план на випадок непередбачених фінансових труднощів.",
    "Інвестуйте у різноманітні активи, розносячи ризики.",
    "Оцінюйте свої фінансові рішення критично.",
    "Не забувайте про інфляцію при плануванні своїх фінансових операцій.",
    "Відкладайте частину своїх доходів на довгострокові цілі.",
    "Уникайте імпульсивних покупок.",
    "Завжди мати чітке уявлення про свій фінансовий стан.",
];

document.getElementById("recommendation-btn").addEventListener("click", () => {
    let randomIndex = Math.floor(Math.random() * recommendations.length);
    document.getElementById("random-recommendation").innerText = recommendations[randomIndex];
    document.getElementById("recommendation-modal").style.display = "block";
});

function closeModal2() {
    document.getElementById("recommendation-modal").style.display = "none";
}
displayEntries();