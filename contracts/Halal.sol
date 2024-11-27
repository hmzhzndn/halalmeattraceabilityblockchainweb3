// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.8.0;

contract Halal {
    struct MeatStorage {
        uint id;
        int temperature;
        uint humidity;
        bool isContaminated;
        uint jakimCertificateId; // Store the JAKIM certificate ID
        bool isHalal;
    }

    mapping(uint => MeatStorage) public meatStorages;
    uint public meatStorageCount;

    // Predefined JAKIM certificate IDs
    uint[] public predefinedJakimCertificates = [
        44278716344976,
        85472987349265,
        23454289672346,
        92358673287487,
        54289172648785,
        45345754635254,
        62463523573526,
        24572562535326,
        84562532464373,
        34562354752624,
        73634526245262,
        34734626373462,
        73465256235625,
        97472643672251,
        43156725141754,
        34253627426437,
        75873474362563,
        54846666346347,
        15236347435623,
        78457362462451,
        84562462372734,
        73465274532135
    ];

    // Events for logging
    event MeatStorageAdded(uint id, int temperature, uint humidity, bool isContaminated, uint jakimCertificateId, bool isHalal);
    event MeatStorageUpdated(uint id, int temperature, uint humidity, bool isContaminated, uint jakimCertificateId, bool isHalal);
    event MeatStorageDeleted(uint id);
    event CertificateValidationFailed(uint id, uint jakimCertificateId);

    // Function to add a meat storage entry
    function addMeatStorage(uint _id, int _temperature, uint _humidity, bool _isContaminated, uint _jakimCertificateId) public {
        require(_id > 0 && meatStorages[_id].id == 0, "ID already exists");
        bool isHalal = verifyJakimCertificate(_jakimCertificateId) && _temperature <= -18 && !_isContaminated;
        meatStorageCount++;
        meatStorages[_id] = MeatStorage(_id, _temperature, _humidity, _isContaminated, _jakimCertificateId, isHalal);
        if (isHalal) {
            emit MeatStorageAdded(_id, _temperature, _humidity, _isContaminated, _jakimCertificateId, isHalal);
        } else {
            emit CertificateValidationFailed(_id, _jakimCertificateId);
        }
    }

    // Function to update a meat storage entry
    function updateMeatStorage(uint _id, int _temperature, uint _humidity, bool _isContaminated, uint _jakimCertificateId) public {
    require(_id > 0 && _id <= meatStorageCount, "Invalid ID");
    MeatStorage storage existingMeatStorage = meatStorages[_id];
    bool isHalal = verifyJakimCertificate(_jakimCertificateId) && _temperature <= -18 && !_isContaminated;
    meatStorages[_id] = MeatStorage(_id, _temperature != 0 ? _temperature : existingMeatStorage.temperature, _humidity != 0 ? _humidity : existingMeatStorage.humidity, _isContaminated, _jakimCertificateId != 0 ? _jakimCertificateId : existingMeatStorage.jakimCertificateId, isHalal);
    if (isHalal) {
        emit MeatStorageUpdated(_id, _temperature, _humidity, _isContaminated, _jakimCertificateId, isHalal);
    } else {
        emit CertificateValidationFailed(_id, _jakimCertificateId);
    }}


    // Function to delete a meat storage entry
    function deleteMeatStorage(uint _id) public {
        require(_id > 0 && _id <= meatStorageCount, "Invalid ID");
        delete meatStorages[_id];
        emit MeatStorageDeleted(_id);
    }

    // Function to get a meat storage entry
    function getMeatStorage(uint _id) public view returns (uint, int, uint, bool, uint, bool) {
        MeatStorage storage ms = meatStorages[_id];
        return (ms.id, ms.temperature, ms.humidity, ms.isContaminated, ms.jakimCertificateId, ms.isHalal);
    }

    // Function to verify JAKIM certificate IDs
    function verifyJakimCertificate(uint _jakimCertificateId) internal view returns (bool) {
        for (uint i = 0; i < predefinedJakimCertificates.length; i++) {
            if (predefinedJakimCertificates[i] == _jakimCertificateId) {
                return true;
            }
        }
        return false;
    }
}
