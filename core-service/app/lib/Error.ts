export class InputError {
  constructor(private error: string, private toast) {
    this.error = error;
    this.toast = toast;
    this.showToast();
  }
  showToast = () => {
    this.toast({
      title: "Invalid input!",
      description: this.error,
      variant: "destructive",
    });
  };
}

export class InvalidActionError {
  constructor(private error: string, private toast) {
    this.error = error;
    this.toast = toast;
    this.showToast();
  }
  showToast = () => {
    this.toast({
      title: "Invalid action!",
      description: this.error,
      variant: "destructive",
    });
  };
}
