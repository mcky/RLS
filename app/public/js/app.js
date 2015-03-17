var findParent = function(element, className) {
	while ((element = element.parentElement) && !element.classList.contains(className))
	return element
}

var modal = {
	find: function(modal) {
		if (typeof(modal) === 'string') {
			return document.getElementById(modal)
		} else {
			return modal
		}
	}
	, show: function(modal) {
		this.find(modal).classList.add('modal--active')
	}
	, close: function(modal) {
		this.find(modal).classList.remove('modal--active')
	}
	, closeAll: function() {
		modals = document.getElementsByClassName('modal')
		for (var i = 0; i < modals.length; i++) {
			modals[i].classList.remove('modal--active')
		}
	}
}

var modalTriggers = document.getElementsByClassName('modalTrigger')
for (var i = 0; i < modalTriggers.length; i++) {
	modalTriggers[i].addEventListener('click', function(e){
		e.preventDefault()
		var modalID = this.dataset.modal + 'Modal'
		modal.show(modalID)
	})
}

modals = document.getElementsByClassName('modal')
for (var i = 0; i < modals.length; i++) {
	modals[i].addEventListener('click', function(e){
		if (e.target.classList.contains('modal')) {
			modal.close(this)
		}
		// var modalID = this.dataset.modal + 'Modal'
		// modal.show(modalID)
	})
}

var bodyClass = document.body.classList
if (bodyClass.contains('Home')) {

} else if (bodyClass.contains('Submit')) {
	var submissionForm = document.getElementsByClassName('submission-form')[0]
		, formSections = document.getElementsByClassName('form__section')
		, fsArray = [].slice.call(formSections)
		, formButtons = document.getElementsByClassName('form__pos')
		, multiChoiceBtns = document.getElementsByClassName('form__multiChoice')
		, progressBar = document.getElementsByClassName('progress-bar__inner')[0]

	var modalBtns = document.getElementsByClassName('modalBtn')
	for (var i = 0; i < modalBtns.length; i++) {
		modalBtns[i].addEventListener('click', function(){
			openModal = findParent(this, 'modal')
			modal.close(openModal)
			if (this.value === 'Edit') {
				goToSection('guide')
			} else {
				submissionForm.submit()
			}
		})
	}

	var parseForm = function(form) {
		var elementsLength = form.elements.length
			, formObj = {}

		for (i = 0; i < elementsLength; i += 1) {
			if (!form[i].name || ((form[i].type === 'checkbox' || form[i].type === 'radio') && !form[i].checked)) {
				continue
			}

			formObj[form[i].name] = form[i].value
		}
		return formObj
	}

	var formData = parseForm(submissionForm)
	var formChanged = function() {
		formData = parseForm(this)
	}

	submissionForm.addEventListener('change', formChanged)

	submissionForm.addEventListener('submit', function(e){
		e.preventDefault()
		modal.show('previewWarnModal')
		console.log('submit form')
	})

	var generatePreview = function() {
		var guideFields = document.getElementsByClassName('guide__field')
			, previewBody = document.getElementsByClassName('preview__body')[0]
			, formDataKeys = Object.keys(formData)
			, previewText = ''

		for (var i = 0; i < formDataKeys.length; i++) {
			var found = formDataKeys[i].match(/guideField-\d/g)
			if (found) {
				fieldText = formData[formDataKeys[i]]
				previewText += '<p>'+ fieldText +'</p>'
			}
		}

		previewBody.innerHTML = previewText
	}
	generatePreview()

	var changeMeta = function(metaSection) {
		publishFields = metaSection.getElementsByClassName('showIfPublished')

		// omg soooooooooo bad. 5:39am tho..
		if (formData.isHosted === true) {
			for (var i = 0; i < publishFields.length; i++) {
				publishFields[i].classList.add('hidden')
			}
		} else {
			for (var i = 0; i < publishFields.length; i++) {
				publishFields[i].classList.remove('hidden')
			}
		}
	}

	var goToSection = function(section) {
		if (typeof(section) === 'string') {
			for (var i = 0; i < formSections.length; i++) {
				if (formSections[i].classList.contains('form__section--'+section)) {
					section = i
				}
			}
		}

		for (var i = 0; i < formSections.length; i++) {
			formSections[i].classList.remove('form__section--active')
		}
		formSections[section].classList.add('form__section--active')
	}

	var changeSection = function() {
		parentElem = this.parentNode
		parentSection = findParent(this, 'form__section')

		isNextButton = this.classList.contains('form__pos--next')
		isMultiChoice = this.classList.contains('form__multiChoice')

		if (isNextButton || isMultiChoice) {
			sibling = parentSection.nextElementSibling
		} else {
			sibling = parentSection.previousElementSibling
		}

		sectionNumber = fsArray.indexOf(sibling)+1
		formCompletion = (sectionNumber/formSections.length)*100
		progressBar.style.width = formCompletion+'%'

		if (sibling.classList.contains('form__section--meta')) changeMeta(sibling)
		if (sibling.classList.contains('form__section--preview')) generatePreview()

		// Refactor to goToSection()
		parentSection.classList.remove('form__section--active')
		sibling.classList.add('form__section--active')

		formData = parseForm(submissionForm)
	}

	for (var i = 0; i < formButtons.length; i++) {
		formButtons[i].addEventListener('click', changeSection)
	}

	for (var i = 0; i < multiChoiceBtns.length; i++) {
		multiChoiceBtns[i].addEventListener('click', changeSection)
	}
}
