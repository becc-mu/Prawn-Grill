(function() {

function FormSaver(form) {
    this.form = form;
    this.fields = this.form.querySelectorAll("input[name]:not([type='submit'])");
    this.formID = this.form.getAttribute("id");
    this.fieldsValues = {};

    this.loadFieldsValues();

    this.addSavingToFields();

    this.form.onsubmit = this.clearLocalStorage.bind(this);
}

FormSaver.prototype.addSavingToFields = function() {

   for(var i = 0; i < this.fields.length; i++) {

        this.fields[i].onchange = this.saveField.bind(this);

    }

}

FormSaver.prototype.saveField = function(e) {

    var that = e.target;

    this.fieldsValues[that.getAttribute("name")] = that.value;

    this.saveToLocalStorage();

}

FormSaver.prototype.saveToLocalStorage = function() {

    window.localStorage.setItem(this.formID, JSON.stringify(this.fieldsValues));

}

FormSaver.prototype.clearLocalStorage = function(e) {

    e.preventDefault();

    window.localStorage.removeItem(this.formID);

}

FormSaver.prototype.loadFieldsValues = function() {

    var savedFields = window.localStorage[this.formID];

    if(savedFields) {

        savedFields = JSON.parse(savedFields);

        for(var key in savedFields) {

            this.form.querySelector("[name='" + key + "']").value = savedFields[key];

        }

    }

}

if("localStorage" in window) {
    var formToSave = new FormSaver(document.querySelector("#form"));
}

})();










(function() {

    //*class validator
    function Validator(form) {
        //if it does not contain pol, we end
        this.form = form;
        this.fields = this.form.querySelectorAll('[required]');
        this.errors = [];
        this.errorsList = document.querySelector('.alert ol');

        //if it does not contain pol, we end
        if(!this.fields.length) return;
        //this.message();

        this.form.onsubmit = function(e){

            e.preventDefault(); //prevent default action

            var formValid = this.validate();

            if(formValid) {
                this.form.submit();

            } else {

              return false; //older browsers
            }

        }.bind(this);//reference to the object
    }

    Validator.prototype.validate = function() {
        this.clearErrors();

        for(var i = 0; i < this.fields.length; i++) {
            //we check all fields
            //checking one field
            this.validateField(this.fields[i]);
        }

        if(!this.errors.length) {
           return true;
        }else {
            this.showErrors();
           return false;
        }

    }

    Validator.prototype.validateField = function(field) {

            var fieldValid = field.validity.valid;

            if(fieldValid){
                this.markAsValid(field);
            }else {
                this.errors.push(field.dataset.errorMessage);
                //gui
                this.markAsInvalid(field);
            }

    }

    Validator.prototype.markAsValid = function(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    }

    Validator.prototype.markAsInvalid = function(field) {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }

    Validator.prototype.showErrors = function() {

        var errorsListElements = document.createDocumentFragment();

        for(var i = 0; i < this.errors.length; i++) {
            var liEl = document.createElement('li');
          liEl.textContent = this.errors[i]; errorsListElements.appendChild(liEl);
        }
            //iterate errors
            //li and inserting into a fragment
        this.errorsList.appendChild(errorsListElements);
        //displaying ol which default display value is none
        this.errorsList.parentNode.style.display = 'block';
    }

    Validator.prototype.clearErrors = function() {
        this.errors.length = 0;
        this.errorsList.parentNode.style.display = 'none';
        this.errorsList.innerHTML = "";
    }


    var validator1 = new Validator(document.querySelector("#form"));

})();
