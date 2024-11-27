App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: async function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      web3 = new Web3(window.web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Halal.json", function(data) {
      App.contracts.Halal = TruffleContract(data);
      App.contracts.Halal.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var halalMeatInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Halal.deployed().then(function(instance) {
      halalMeatInstance = instance;
      return halalMeatInstance.meatStorageCount();
    }).then(function(meatStorageCount) {
      var meatStoragesResults = $("#meatStoragesResults tbody");
      meatStoragesResults.empty();

      for (var i = 1; i <= meatStorageCount; i++) {
        halalMeatInstance.meatStorages(i).then(function(meatStorage) {
          var id = meatStorage.id.toNumber();
          var temperature = meatStorage.temperature.toNumber();
          var humidity = meatStorage.humidity.toNumber();
          var isContaminated = meatStorage.isContaminated;
          var jakimCertificateId = meatStorage.jakimCertificateId.toNumber();
          var isHalal = meatStorage.isHalal;

          var meatStorageTemplate = `<tr><th>${id}</th><td>${temperature}</td><td>${humidity}</td><td>${isContaminated}</td><td>${jakimCertificateId}</td><td>${isHalal}</td></tr>`;
          meatStoragesResults.append(meatStorageTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  addMeatStorage: function() {
    var id = $('#addMeatId').val();
    var temperature = $('#addTemperature').val();
    var humidity = $('#addHumidity').val();
    var isContaminated = $('#addIsContaminated').prop('checked');
    var jakimCertificateId = $('#addJakimCertificateId').val();

    App.contracts.Halal.deployed().then(function(instance) {
      return instance.addMeatStorage(id, temperature, humidity, isContaminated, jakimCertificateId, { from: App.account });
    }).then(function(result) {
      alert('Meat Storage added successfully!');
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  updateMeatStorage: function() {
    var id = $('#updateMeatId').val();
    var attribute = $('#updateAttribute').val();
    var value = $('#updateValue').val();

    App.contracts.Halal.deployed().then(function(instance) {
      if (attribute === 'temperature') {
        return instance.updateMeatStorage(id, value, 0, false, 0, { from: App.account });
      } else if (attribute === 'humidity') {
        return instance.updateMeatStorage(id, 0, value, false, 0, { from: App.account });
      } else if (attribute === 'isContaminated') {
        return instance.updateMeatStorage(id, 0, 0, value === 'true', 0, { from: App.account });
      } else if (attribute === 'jakimCertificateId') {
        return instance.updateMeatStorage(id, 0, 0, false, value, { from: App.account });
      }
    }).then(function(result) {
      alert('Meat Storage updated successfully!');
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  deleteMeatStorage: function() {
    var id = $('#deleteMeatId').val();

    App.contracts.Halal.deployed().then(function(instance) {
      return instance.deleteMeatStorage(id, { from: App.account });
    }).then(function(result) {
      alert('Meat Storage deleted successfully!');
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  getMeatStorage: function() {
    var id = $('#getMeatId').val();

    App.contracts.Halal.deployed().then(function(instance) {
      return instance.meatStorages(id);
    }).then(function(meatStorage) {
      if (meatStorage.id > 0) {
        $('#meatStorageResult').html(`
          <p><strong>ID:</strong> ${meatStorage.id.toNumber()}</p>
          <p><strong>Temperature:</strong> ${meatStorage.temperature.toNumber()}</p>
          <p><strong>Humidity:</strong> ${meatStorage.humidity.toNumber()}</p>
          <p><strong>Is Contaminated:</strong> ${meatStorage.isContaminated}</p>
          <p><strong>JAKIM Certificate ID:</strong> ${meatStorage.jakimCertificateId.toNumber()}</p>
          <p><strong>Is Halal:</strong> ${meatStorage.isHalal}</p>
        `);
      } else {
        $('#meatStorageResult').html('<p>Meat Storage not found.</p>');
      }
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).on('load', function() {
    App.init();
  });

  $('#addMeatStorageForm').submit(function(event) {
    event.preventDefault();
    App.addMeatStorage();
  });

  $('#updateMeatStorageForm').submit(function(event) {
    event.preventDefault();
    App.updateMeatStorage();
  });

  $('#deleteMeatStorageForm').submit(function(event) {
    event.preventDefault();
    App.deleteMeatStorage();
  });

  $('#getMeatStorageForm').submit(function(event) {
    event.preventDefault();
    App.getMeatStorage();
  });
});
