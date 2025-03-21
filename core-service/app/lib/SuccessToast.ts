export class SuccessToast {
  constructor(private message: string, private toast) {
    this.message = message;
    this.toast = toast;
    this.showToast();
  }
  showToast = () => {
    this.toast({
      title: "Success!",
      description: this.message,
    });
  };
}
