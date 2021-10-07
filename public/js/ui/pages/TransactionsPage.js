/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    // lastOptions = [];

    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (!element) throw new Error('элемент не существует');

        this.element = element;

        this.registerEvents();
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        this.render(this.lastOptions);
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        this.element.addEventListener('click', (e) => {
            const trg = e.target;

            if (trg.classList.contains('remove-account')) {
                this.removeAccount();
            } else if (trg.classList.contains('transaction__remove')) {
                this.removeTransaction(trg.dataset.id);
            }
        });
    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.updateWidgets(),
     * либо обновляйте только виджет со счетами
     * для обновления приложения
     * */
    removeAccount() {
        if (this.lastOptions) {
            let textConfirm = confirm('Вы действительно хотите удалить счёт?');
            if (textConfirm) {
                const data = { id: this.lastOptions.account_id };
                Account.remove(data, (err, response) => {
                    if (response.success) {
                        App.updateWidgets();
                        this.clear();
                    } else alert(err);
                });
            }
        }
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update(),
     * либо обновляйте текущую страницу (метод update) и виджет со счетами
     * */
    removeTransaction(id) {
        console.log(id + '===id');
        if (id) {
            let textConfirm = confirm(
                'Вы действительно хотите удалить эту транзакцию?'
            );
            const data = { id };

            if (textConfirm) {
                Transaction.remove(data, (err, response) => {
                    if (response.success) {
                        App.update();
                    } else alert(err);
                });
            }
        }
    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        if (!options) return;

        this.lastOptions = options;
        Account.get(options.account_id, (err, response) => {
            if (response && response.data) {
                this.renderTitle(response.data.name);
            }
        });

        Transaction.list(options, (err, response) => {
            if (response) {
                this.renderTransactions(response.data);
            } else console.error(err);
        });
    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        this.renderTransactions([]);
        this.renderTitle('Название счёта');
        this.lastOptions = '';
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        const contentTitle = this.element.querySelector('.content-title');
        contentTitle.textContent = name;
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        const parse = new Date(Date.parse(date));

        const monthNames = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ];

        const dd = ('0' + parse.getDate()).slice(-2);
        const mm = ('' + parse.getMonth()).slice(-2);
        const yy = parse.getFullYear();
        const hh = ('0' + parse.getHours()).slice(-2);
        const ii = ('0' + parse.getMinutes()).slice(-2);

        return `${dd} ${monthNames[mm]} ${yy} г. в ${hh}:${ii}`;
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        const date = this.formatDate(item['created_at']);

        return `<div class="transaction transaction_${item.type} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                    <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                    <h4 class="transaction__title">${item.name}</h4>
                    <!-- дата -->
                    <div class="transaction__date">${date}</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="transaction__summ">
                <!--  сумма -->
                    ${item.sum} <span class="currency">₽</span>
                </div>
              </div>
              <div class="col-md-2 transaction__controls">
                  <!-- в data-id нужно поместить id -->
                  <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                      <i class="fa fa-trash"></i>
                  </button>
              </div>
          </div>`;
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {
        const content = this.element.querySelector('.content');

        let html = '';
        data.forEach((transaction) => {
            html += this.getTransactionHTML(transaction);
        });
        content.innerHTML = html;
    }
}
