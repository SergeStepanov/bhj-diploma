/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
        super(element);
        this.renderAccountsList();
    }

    /**
     * Получает список счетов с помощью Account.list
     * Обновляет в форме всплывающего окна выпадающий список
     * */
    renderAccountsList() {
        const accountsSelect = this.element.querySelector('.accounts-select');
        Array.from(accountsSelect).forEach((elem) => elem.remove());
        Account.list(User.current(), (err, response) => {
            if (response && response.success) {
                for (let item of response.data) {
                    const htmlOption = `<option value="${item.id}">${item.name}</option>`;
                    accountsSelect.innerHTML += htmlOption;
                }
            }
        });
    }

    /**
     * Создаёт новую транзакцию (доход или расход)
     * с помощью Transaction.create. По успешному результату
     * вызывает App.update(), сбрасывает форму и закрывает окно,
     * в котором находится форма
     * */
    onSubmit(data) {
        Transaction.create(data, (err, response) => {
            if (response && response.success) {
                if (this.element.id === 'new-expense-form') {
                    App.getModal('newExpense').close();
                } else {
                    App.getModal('newIncome').close();
                }
                App.update();
                this.element.reset();
            } else {
                console.log(err);
            }
        });
    }
}
