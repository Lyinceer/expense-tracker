const sheet = document.getElementById('records-body');
const tally = document.getElementById('count-display');
const grand = document.getElementById('sum-display');
const sifter = document.getElementById('filter-tag');

const label = document.getElementById('exp-title');
const price = document.getElementById('exp-cost');
const genre = document.getElementById('exp-tag');
const chrono = document.getElementById('exp-date');
const submit = document.getElementById('save-btn');

const xiugai = document.getElementById('edit-overlay');
const revamp = document.getElementById('edit-title');
const charge = document.getElementById('edit-cost');
const sort = document.getElementById('edit-tag');
const moment = document.getElementById('edit-date');
const commit = document.getElementById('confirm-edit-btn');
const dismiss = document.getElementById('cancel-edit-btn');

const sakujo = document.getElementById('delete-overlay');
const purge = document.getElementById('confirm-del-btn');
const revert = document.getElementById('cancel-del-btn');

let archive = JSON.parse(localStorage.getItem('user_expenses')) || [];
let target = null;
let victim = null;
let expenseChart = null;

function rupiah(val) {
    return 'Rp ' + val.toLocaleString('id-ID');
}

function tubiao(list = archive) {
    const categories = ['Makanan', 'Transportasi', 'Belanja', 'Lainnya'];
    const totals = categories.map(category =>
        list
            .filter(entry => entry.category === category)
            .reduce((sum, entry) => sum + entry.amount, 0)
    );

    const canvas = document.getElementById('expense-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const chartColors = ['#31d57b', '#9d26c1', '#E9C46A', '#E76F51'];
    const firstActive = totals.findIndex(total => total > 0);
    let lastActive = -1;
    totals.forEach((total, index) => {
        if (total > 0) lastActive = index;
    });
    const getBorderRadius = index => ({
        topLeft: index === firstActive ? 12 : 0,
        bottomLeft: index === firstActive ? 12 : 0,
        topRight: index === lastActive ? 12 : 0,
        bottomRight: index === lastActive ? 12 : 0
    });

    if (expenseChart) {
        expenseChart.data.datasets.forEach((dataset, index) => {
            dataset.data = [totals[index]];
            dataset.borderRadius = getBorderRadius(index);
        });
        expenseChart.update();
    } else {
        expenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total'],
                datasets: categories.map((category, index) => ({
                    label: category,
                    data: [totals[index]],
                    backgroundColor: chartColors[index],
                    borderRadius: getBorderRadius(index),
                    borderSkipped: false,
                    barThickness: 42
                }))
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        display: false,
                        beginAtZero: true
                    },
                    y: {
                        stacked: true,
                        display: false
                    }
                },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            title: contexts => contexts[0].dataset.label,
                            label: context => rupiah(context.raw)
                        }
                    }
                }
            }
        });
    }
}

function paint() {
    sheet.innerHTML = '';
    const choice = sifter.value;

    const visible = choice === 'All'
        ? archive
        : archive.filter(entry => entry.category === choice);

    let accumulator = 0;

    if (visible.length === 0) {
        sheet.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cell">Belum ada catatan pengeluaran.</td>
            </tr>
        `;
    } else {
        visible.forEach(entry => {
            accumulator += entry.amount;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entry.title}</td>
                <td>${entry.category}</td>
                <td>${entry.date}</td>
                <td>${rupiah(entry.amount)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit" onclick="triggerEdit(${entry.id})">Edit</button>
                        <button class="btn-del" onclick="triggerDelete(${entry.id})">Hapus</button>
                    </div>
                </td>
            `;
            sheet.appendChild(tr);
        });
    }

    tally.textContent = visible.length;
    grand.textContent = rupiah(accumulator);
    tubiao(visible);
}

function inspect() {
    const ready = label.value.trim() !== '' &&
                  price.value > 0 &&
                  genre.value !== '' &&
                  chrono.value !== '';
    submit.disabled = !ready;
}

[label, price, genre, chrono].forEach(elem => {
    elem.addEventListener('input', inspect);
});

submit.addEventListener('click', () => {
    const fresh = {
        id: Date.now(),
        title: label.value.trim(),
        amount: parseFloat(price.value),
        category: genre.value,
        date: chrono.value
    };

    archive.push(fresh);
    localStorage.setItem('user_expenses', JSON.stringify(archive));

    label.value = '';
    price.value = '';
    genre.value = '';
    chrono.value = '';
    submit.disabled = true;

    paint();
});

window.triggerEdit = function(id) {
    const matched = archive.find(x => x.id === id);
    if (!matched) return;

    target = id;
    revamp.value = matched.title;
    charge.value = matched.amount;
    sort.value = matched.category;
    moment.value = matched.date;

    xiugai.style.display = 'flex';
};

commit.addEventListener('click', () => {
    const pos = archive.findIndex(x => x.id === target);
    if (pos !== -1) {
        archive[pos] = {
            id: target,
            title: revamp.value.trim(),
            amount: parseFloat(charge.value) || 0,
            category: sort.value,
            date: moment.value
        };
        localStorage.setItem('user_expenses', JSON.stringify(archive));
        paint();
    }
    xiugai.style.display = 'none';
});

dismiss.addEventListener('click', () => {
    xiugai.style.display = 'none';
});

window.triggerDelete = function(id) {
    victim = id;
    sakujo.style.display = 'flex';
};

purge.addEventListener('click', () => {
    archive = archive.filter(x => x.id !== victim);
    localStorage.setItem('user_expenses', JSON.stringify(archive));
    paint();
    sakujo.style.display = 'none';
});

revert.addEventListener('click', () => {
    sakujo.style.display = 'none';
});

sifter.addEventListener('change', paint);

paint();