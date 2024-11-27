document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('toggleTableBtn').addEventListener('click', function() {
      var tableContainer = document.getElementById('meatStorageTable');
      if (tableContainer.classList.contains('hidden')) {
        tableContainer.classList.remove('hidden');
        tableContainer.classList.add('visible');
        this.textContent = 'Hide All Meat Storages';
      } else {
        tableContainer.classList.remove('visible');
        tableContainer.classList.add('hidden');
        this.textContent = 'Show All Meat Storages';
      }
    });
  });
  