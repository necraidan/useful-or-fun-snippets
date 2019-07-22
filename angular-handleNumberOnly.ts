  /*
   * (input)="handleNumberOnly($event, 'contrat')"
   */
  // InputEvent
  handleNumberOnly(event: any, formControlName: string) {
    const eventValue = event.target.value;
    const lastChar = eventValue ? eventValue[eventValue.length - 1] : '';

    if (lastChar === 'e' || lastChar === '.' || isNaN(+eventValue)) {
      const value = this.form.get(formControlName).value;
      this.form.get(formControlName).setValue(value.substring(0, value.length - 1));
    }
  }
