
// Đối tượng Validator
const  Validator = (options) => {
    const formElement = document.querySelector(options.form)
    const selectorRules = {}

    // hàm xử lý validate 
    const validate = (inputElement,rule) => {
        const errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        let errorMessage
            // lấy ra các rule của selector 
        const rules = selectorRules[rule.selector]
            // lặp qua từng rule và kiểm tra 
        for(var i=0;i <  rules.length ; i++){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break
        }
                   
                   if(errorMessage) {
                    errorElement.innerHTML = errorMessage
                    inputElement.parentElement.classList.add('invalid')
                   }else{
                    errorElement.innerHTML = '' 
                    inputElement.parentElement.classList.remove('invalid')
                   }

        return errorMessage 
    }
    
    if (formElement){
        //    KHI SUBMIT FORM 
        formElement.onsubmit = (e) => {
            e.preventDefault()

            let isFormValid = true

            options.rules.forEach( (rule) => {
                const inputElement = formElement.querySelector(rule.selector)
                const isValid = validate(inputElement,rule)

                if(isValid) {
                    isFormValid = false; 
                }
            })

                     
            if(isFormValid) {
                if(typeof options.onSubmit === 'function'){
                    const enableInputs = formElement.querySelectorAll('[name]')
                    const formValues = Array.from(enableInputs).reduce((values,input) => {
                        values[input.name] = input.value
                        return values 
                    }, {})
                    options.onSubmit(formValues)
                }else{
                    formElement.submit()
                }
            }

        } 

       options.rules.forEach( (rule) => {
           const inputElement = formElement.querySelector(rule.selector)

             
        //    Lưu lại các rules cho mỗi input 
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
           
        //    Lấy element của form cần validate
           if (inputElement) {
               inputElement.onblur = () => {
                validate(inputElement,rule)
               }
        //    trường hợp user đang nhập 
            inputElement.oninput = () => {
                const errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                errorElement.innerHTML = '' 
                inputElement.parentElement.classList.remove('invalid')
            }
           }
       });
    }
}

// Định nghĩa các rules
// Nguyên tắc của các rules :
// 1. Khi có lỗi => trả ra message lỗi
// 2. Khi hợp lệ => Ko trả ra gì cả (undefined)
Validator.isRequired = (selector,  message ) => {
    return {
        selector,
        test : (value) => {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = (selector) => {
    return {
        selector,
        test : (value) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined :  'Trường này phải là email'
        }
    }
}

Validator.minLength = (selector, min) => {
    return {
        selector,
        test : (value) => {
            return value.length >= min ? undefined :  `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

Validator.checkRePass = (selector,check,message) => {
    return {
        selector,
        test : (value) => {
            return value === check() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}