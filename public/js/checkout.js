document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based in JS
    const currentYear = currentDate.getFullYear();
    
    const expiryMonthSelect = document.getElementById('expiryMonth');
    const expiryYearSelect = document.getElementById('expiryYear');
    
    function updateMonths() {
        const selectedYear = parseInt(expiryYearSelect.value, 10);
        for (let i = 0; i < expiryMonthSelect.options.length; i++) {
            const option = expiryMonthSelect.options[i];
            const monthValue = parseInt(option.value, 10);
            if (selectedYear === currentYear && monthValue < currentMonth) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        }
    }
    
    expiryYearSelect.addEventListener('change', updateMonths);
    
    // Initialize the month options based on the current year selection
    updateMonths();
});