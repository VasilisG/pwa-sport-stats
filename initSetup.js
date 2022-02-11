(function(){

    let overlay = document.getElementById('overlay');
    let sportOptions = document.getElementById('sport-options');
    let athletesField = document.getElementById('athletes-input-field');
    let createTableButton = document.getElementsByClassName('submit-setup-button')[0];

    /**
     * Checks in input is valid number.
     * @param {*} value - Value to check.
     * @returns true if it's valid positive number, else false.
     */
    function isValidNumber(value){
        return !isNaN(parseInt(value)) && parseInt(value) > 0;
    }

    /**
     * Checks if any option has been selected.
     * @returns true if any option has been selected, else false.
     */
    function isValidSport(){
        return sportOptions.value !== '-';
    }

    /**
     * Get sport option.
     * @returns Dropdown option.
     */
    function getSport(){
        return sportOptions.value;
    }

    /**
     * Check if number of athletes is valid.
     * @returns true if it's valid, else false.
     */
    function isValidNumberOfAthletes(){
        return isValidNumber(athletesField.value);
    }

    /**
     * Get number of athletes.
     * @returns number of athletes.
     */
    function getNumberOfAthletes() {
        return parseInt(athletesField.value);
    }

    /**
     * Shows the setup modal.
     */
    function showSetupModal(){
        overlay.classList.remove('overlay-disabled');
    }

    /**
     * Hides the setup modal.
     */
    function hideSetupModal(){
        overlay.classList.add('overlay-disabled');
    }

    /**
     * Clears athletes input field.
     */
    function clearAthletesField(){
        athletesField.value = "";
    }

    /**
     * Creates table caption.
     * @param {*} caption - the name of the caption.
     * @returns a caption element.
     */
    function createCaption(caption){
        let captionElem = document.createElement('caption');
        captionElem.innerText = caption;
        return captionElem;
    }

    /**
     * Creates table head.
     * @returns a head element.
     */
    function createHead(){
        let tHead = document.createElement('thead');
        let tHeadRow = createHeadRow();
        tHead.appendChild(tHeadRow);
        return tHead;
    }

    /**
     * Creates a table head row.
     * @returns a table head row element.
     */
    function createHeadRow(){
        let trElem = document.createElement('tr');

        let nameColumn = createHeadColumn('Name');
        let ageColumn = createHeadColumn('Age');
        let timeColumn = createHeadColumn('Time');
        let appearanceColumn = createHeadColumn('Appearances');
        let medalColumn = createHeadColumn('Medals');
        let countryColumn = createHeadColumn('Country');

        trElem.appendChild(nameColumn);
        trElem.appendChild(ageColumn);
        trElem.appendChild(timeColumn);
        trElem.appendChild(appearanceColumn);
        trElem.appendChild(medalColumn);
        trElem.appendChild(countryColumn);

        return trElem;
    }

    /**
     * Creates a head column.
     * @param {*} value - The column's value.
     * @returns 
     */
    function createHeadColumn(value){
        let tdElem = document.createElement('td');
        tdElem.innerHTML = value;
        return tdElem;
    }

    /**
     * Create a table tfoot element.
     * @returns a table tfoot element.
     */
    function createTFoot(){
        return document.createElement('tfoot');
    }

    /**
     * Creates a table element.
     * @param {*} caption - the table's caption.
     * @param {*} numOfRows - the number of table rows.
     */
    function createTable(caption, numOfRows){

        function createEmptyBody(){
            let tBody = document.createElement('tbody');
            for(let i=0; i<numOfRows; i++){
                let row = createEmptyRow();
                tBody.appendChild(row);
            }
            return tBody;
        }

        function createEmptyRow(){
            let row = document.createElement('tr');
            for(let i=0; i<6; i++){
                let column = createEmptyCell();
                row.appendChild(column);
            }
            return row;
        }

        function createEmptyCell(){
            let column = document.createElement('td');
            column.innerHTML = '-';
            return column;
        }

        let table = document.createElement('table');
        table.classList.add('uomTrack');

        let tCaption = createCaption(caption);
        let tHead = createHead();
        let tBody = createEmptyBody();
        let tFoot = createTFoot();

        table.appendChild(tCaption);
        table.appendChild(tHead);
        table.appendChild(tBody);
        table.appendChild(tFoot);

        document.body.appendChild(table);
    }

    /**
     * Creates table back from localStorage data.
     */
    function restoreTable(){

        function restoreBody(tableData){
            let tBody = document.createElement('tbody');
            tableData.forEach((entryData) => {
                let row = restoreRow(entryData);
                tBody.appendChild(row);
            });
            return tBody;
        }

        function restoreRow(entryData){
            let row = document.createElement('tr');
            for(let key in entryData){
                let cell = restoreCell(entryData[key]);
                row.appendChild(cell);
            }
            return row;
        }

        function restoreCell(entryValue){
            let cell = document.createElement('td');
            cell.innerHTML = entryValue;
            return cell;
        }

        let caption = localStorage.getItem('caption');
        let tableData = JSON.parse(localStorage.getItem('table_data'));

        let table = document.createElement('table');
        table.classList.add('uomTrack');

        let tCaption = createCaption(caption);
        let tHead = createHead();
        let tBody = restoreBody(tableData);
        let tFoot = createTFoot();

        table.appendChild(tCaption);
        table.appendChild(tHead);
        table.appendChild(tBody);
        table.appendChild(tFoot);

        document.body.appendChild(table);
    }

    /**
     * Creates initial table data.
     * @param {*} numOfAthletes - number of athletes.
     * @returns table data in JSON format.
     */
    function generateInitialTableData(numOfAthletes){
        let tableData = [];
        for(let i=0; i<numOfAthletes; i++){
            tableData.push({
                'name'          : '-',
                'age'           : '-',
                'time'          : '-',
                'appearances'   : '-',
                'medals'        : '-',
                'country'       : '-'
            });
        }
        return JSON.stringify(tableData);
    }

    /**
     * Adds listener to create table button in order to handle input data.
     */
    function addCreateTableListener(){
        createTableButton.addEventListener('click', (event) => {
            event.preventDefault();
            if(isValidSport() && isValidNumberOfAthletes()){
                let sport = getSport();
                let numberOfAthletes = getNumberOfAthletes();
                let initialTableData = generateInitialTableData(numberOfAthletes);
                hideSetupModal();
                createTable(sport, numberOfAthletes);
                uomTrack();
                setLocalStorageData(sport, numberOfAthletes, true, initialTableData);
            }
            else {
                clearAthletesField();
            }
        });
    }

    /**
     * Saves data to local storage.
     * @param {*} sport 
     * @param {*} numberOfAthletes 
     * @param {*} setupInit 
     * @param {*} tableData 
     */
    function setLocalStorageData(sport, numberOfAthletes, setupInit, tableData){
        localStorage.setItem('caption', sport);
        localStorage.setItem('number_of_athletes', numberOfAthletes);
        localStorage.setItem('setup_init_complete', setupInit);
        localStorage.setItem('table_data', tableData);
    }

    /**
     * Runs table setup.
     */
    function initTableSetup(){
        showSetupModal();
        addCreateTableListener();
    }

    if(localStorage.getItem('setup_init_complete') == null){
        initTableSetup();
    }
    else {
        restoreTable();
        uomTrack();
    }

})();