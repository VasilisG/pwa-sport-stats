function uomTrack(){

    /**
     * Maps column indices with table row properties.
     */
    const SORT_MAPPING = {
        0 : 'name',
        1 : 'age',
        2 : 'time',
        3 : 'appearances',
        4 : 'medals',
        5 : 'country'
    };

    /**
     * Lookup to be used in comparisons during sorting operations.
     */
    const SORT_TYPE = {
        'string' : [0, 5],
        'int' : [1, 3, 4],
        'float'  : [2]
    };

    /**
     * Sort order lookup to detect ascending or descending order when sorting.
     */
    const ORDER_TYPE = {
        'asc' : 1,
        'desc' : -1
    };

    /**
     * Initializes uomTrack.js for each table element containing the 'uomTrack' class.
     */
    function init(){
        let elems = document.getElementsByClassName('uomTrack');
        if(elems.length == 0){
            console.warn('uomTrack.js: No table element with class "uomTrack" found.');
        }
        else {
            for(elem of elems){
                if(isTable(elem)){
                    uomTrackize(elem);
                }
                else{
                    console.error('uomTrack.js: Class "uomTrack" expected to be used in "table" element, found class in "' + getLowerTagName(elem) + '" element.');
                }
            }
        }
    }

    /**
     * Converts an HTML table's cells to editable, add sorting in each column and calculates best, worst and average time.
     * @param {*} table - The HTML table that will be converted.
     */
    function uomTrackize(table){
        makeCellsEditable(table);
        addActionButtons(table);
        addActionListeners(table);
        addSortListeners(table);
        addInputChangeListeners(table);
        updateStats(table);
        updateStorageTableData(table);
        createColumnFilters();
    }

    /**
     * Converts a table's cells to input elements. If there aren't any rows, it creates a dummy one.
     * @param {*} table - The HTML table whose cells will be converted to input elements.
     */
    function makeCellsEditable(table){
        let rows = getBodyRows(table);
        if(rows.length > 0){
            for(row of rows){
                row.classList.add('uom-row');
                let cells = row.getElementsByTagName('td');
                if(cells.length > 0){
                    let currentCellIndex = 1;
                    for(cell of cells){
                        createEditableCell(cell, currentCellIndex);
                        currentCellIndex++;
                    }
                }
            }
        }
        else {
            createDummyRow(table);
        }
    }

    /**
     * Converts a table cell to input element.
     * @param {*} cell - The cell that will be converted to input element. 
     */
    function createEditableCell(cell, currentCellIndex){
        let inputField = document.createElement('input');
        inputField.classList.add('uom-field');
        inputField.value = cell.innerHTML;
        cell.innerHTML = '';
        cell.classList.add('uom-cell');
        cell.setAttribute('column', currentCellIndex);
        cell.appendChild(inputField);
    }

    /**
     * Creates a single row with some placeholder values in a table.
     * @param {*} table - The HTML table in which the dummy row will be created.
     */
    function createDummyRow(table){
        let body = table.querySelector('tbody');
        let dummyRow = document.createElement('tr');
        dummyRow.classList.add('uom-row');

        let nameCell = createCell('-');
        let ageCell = createCell('0');
        let timeCell = createCell('0.0');
        let appearancesCell = createCell('0');
        let medalsCell = createCell('0');
        let countryCell = createCell('-');

        dummyRow.appendChild(nameCell);
        dummyRow.appendChild(ageCell);
        dummyRow.appendChild(timeCell);
        dummyRow.appendChild(appearancesCell);
        dummyRow.appendChild(medalsCell);
        dummyRow.appendChild(countryCell);

        body.appendChild(dummyRow);
    }

    /**
     * Creates a table cell with the value specified in the 'value' parameter.
     * @param {*} value - The value which will be added in the table cell. 
     * @returns The newly created table cell.
     */
    function createCell(value){
        let cell = document.createElement('td');
        cell.classList.add('uom-cell');

        let inputField = document.createElement('input');
        inputField.value = value;

        cell.appendChild(inputField);

        return cell;
    }

    /**
     * Adds action buttons in each row in an HTML table.
     * @param {*} table - The HTML table whose rows will get the action buttons.
     */
    function addActionButtons(table){
        let rows = getBodyRows(table);
        if(rows.length > 0){
            for(row of rows){
                addRowActionButtons(row);
            }
        }
    }

    /**
     * Adds actions buttons (duplicate, delete) in a table row.
     * @param {*} row - The row in which the 'duplicate' and 'delete' action buttons will be added. 
     */
    function addRowActionButtons(row){
        addRowActionButton(row, 'duplicate', 'Duplicate');
        addRowActionButton(row, 'delete', 'Delete');
    }

    /**
     * Adds an action button in a table row.
     * @param {*} row - The table row in which the action button will be added.
     * @param {*} className - The name of the button's class.
     * @param {*} title - The name of button's title.
     */
    function addRowActionButton(row, className, title){
        let actionButton = document.createElement('button');
        actionButton.type = 'button';
        actionButton.classList.add('uom-button-' + className);
        actionButton.title = title;
        actionButton.value = title;

        let rowActionCell = document.createElement('td');
        rowActionCell.classList.add('uom-cell-' + className);
        rowActionCell.appendChild(actionButton);

        row.appendChild(rowActionCell);
    }

    /**
     * Adds listeners to trigger when an action button is clicked in a table row, through event delegation.
     * @param {*} table - The table in which the listeners will be added.
     */
    function addActionListeners(table){
        let tbody = table.querySelector('tbody');

        /**
         * Duplicates a table row.
         * @param {*} event - The event from which we will get the row element.
         * @param {*} tbody - The table's body to insert the row.
         */
        function duplicateRow(event, tbody){
            let currentRow = event.target.parentNode.parentNode;
            let newRow = currentRow.cloneNode(true);
            tbody.insertBefore(newRow, currentRow.nextElementSibling);
        }

        /**
         * Deletes a table row.
         * @param {*} event - The event from which we will get the row element.
         * @param {*} tbody - The table's body to delete the row.
         */
        function deleteRow(event, tbody){
            let currentRow = event.target.parentNode.parentNode;
            tbody.removeChild(currentRow);
        }

        table.addEventListener('click', function(event){
            let rows = getBodyRows(table);
            if(event.target.classList.contains('uom-button-duplicate')){
                duplicateRow(event, tbody);
                updateStats(table);
                updateStorageTableData(table);
            }
            if(event.target.classList.contains('uom-button-delete')){
                if(rows.length > 1){
                    deleteRow(event, tbody);
                    updateStats(table);
                    updateStorageTableData(table);
                }
            }
        });
    }

    /**
     * Updates the table's best, worst and average time by updating the table tfoot element.
     * @param {*} table - The HTML table whose tfoot is to be updated.
     */
    function updateStats(table){
        let rows = getBodyRows(table);
        let times = getRowTimes(rows);
        
        let bestTime = getTime(times, 'best');
        let worstTime = getTime(times, 'worst');
        let avgTime = getTime(times, 'avg');

        updateFoot(table, bestTime, worstTime, avgTime);
    }

    /**
     * Updates the table's tfoot element with the new best, worst, average times. If times elements are not set, it creates them.
     * @param {*} table - The HTML table whose tfoot is to be updated.
     * @param {*} bestTime - The new best time.
     * @param {*} worstTime - The new worst time.
     * @param {*} avgTime - The new average time.
     */
    function updateFoot(table, bestTime, worstTime, avgTime){
        let tfoot = table.querySelector('tfoot');
        let scoresContainer = tfoot.querySelector('.uom-scores-container');

        if(scoresContainer != null){
            updateTimeElement(bestTime, 'uom-best-time');
            updateTimeElement(worstTime, 'uom-worst-time');
            updateTimeElement(avgTime, 'uom-avg-time');
        }
        else {
            let scoresContainer = document.createElement('tr');
            scoresContainer.classList.add('uom-scores-container');
    
            let bestTimeElement = createTimeElement(bestTime, 'Best Time:', 'uom-best-time');
            let worstTimeElement = createTimeElement(worstTime, 'Worst Time:', 'uom-worst-time');
            let avgTimeElement = createTimeElement(avgTime, 'Avg. Time:', 'uom-avg-time');
    
            scoresContainer.appendChild(bestTimeElement);
            scoresContainer.appendChild(worstTimeElement);
            scoresContainer.appendChild(avgTimeElement);

            tfoot.appendChild(scoresContainer);
        }
    }

    /**
     * Creates a new time element to be used in tfoot.
     * @param {*} time - The time value.
     * @param {*} elemTitle - The element's tutle.
     * @param {*} elemClass - The element's class.
     * @returns 
     */
    function createTimeElement(time, elemTitle, elemClass){
        let timeCell = document.createElement('td');
        timeCell.classList.add('uom-time-container');

        let timeTitleElement = document.createElement('span');
        timeTitleElement.classList.add('uom-time-title');
        timeTitleElement.innerHTML = elemTitle;

        let timeElement = document.createElement('span');
        timeElement.classList.add(...['uom-time', elemClass]);
        timeElement.innerHTML = time;

        timeCell.appendChild(timeTitleElement);
        timeCell.appendChild(timeElement);

        return timeCell;
    }

    /**
     * Updates an already existing time element.
     * @param {*} time - The new time value.
     * @param {*} elemClass - The element's class to be used to find the element.
     */
    function updateTimeElement(time, elemClass){
        let elem = document.querySelector('.' + elemClass);
        elem.innerHTML = time;
    }

    /**
     * Gets all table times from each row.
     * @param {*} rows - The table rows from which the times will be extracted.
     * @returns An array containing the table's times.
     */
    function getRowTimes(rows){
        let times = [];
        if(rows.length > 0){
            for(row of rows){
                let cell = row.getElementsByTagName('td')[2];
                let input = cell.querySelector('input');
                let time = parseFloat(input.value);
                times.push(time);
            }
        }
        return times;
    }

    /**
     * Calculates and returns the final time, whether it's best, worst or average, depending on flag.
     * In case the calculation is impossible to product a valid result, a placeholder value will be returned.
     * @param {*} times - All time values to be used for the calculation of time.
     * @param {*} flag - A value that determines what kind of time will be calculated. Possible values: best, worst, avg.
     * @returns 
     */
    function getTime(times, flag){
        if(times.length == 0){
            return '-';
        }
        else {
            if(flag == 'avg'){
                let summation = times.reduce(function(time1, time2){
                    return time1 + time2;
                });
                let avg = summation / times.length;
                avg = avg.toFixed(2);
                if(isNaN(avg)) avg = '-';
                return avg;
            }
            else {
                let result = flag == 'best' ? Math.min(...times) : Math.max(...times);
                result = result.toFixed(2);
                if(isNaN(result)) result = '-';
                return result;
            }
        }
    }

    /**
     * Adds sort listeners to table for each column.
     * @param {*} table - The HTML table to add the sort listeners.
     */
    function addSortListeners(table){

        let rows = getBodyRows(table);

        /**
         * Adds classes to headers to assist in sorting mechanism.
         */
        function setSortHeaders(){
            let head = table.querySelector('thead');
            let headers = head.getElementsByTagName('td');
            let headerIndex = 1;
            for(header of headers){
                header.classList.add('uom-sort-header');
                header.setAttribute('order', 'asc');
                header.setAttribute('column', headerIndex);
                header.title = 'Sort by ' + header.textContent;
                headerIndex++;
            }
        }

        /**
         * Sorts and returns all table rows by a specified column. 
         * It checks what kind of type are the data to be sorted and uses the respective comparisons for strings, integers and floats.
         * @param {*} columnIndex - The index of the column to be used for sorting.
         * @param {*} order - The sorting order. Possible values: asc, desc.
         * @returns An array containing the sorted row data.
         */
        function getSortedRowsByColumn(columnIndex, order='asc'){
            let cellData = [];
            for(row of rows){
                let cells = row.children;
                cellData.push({
                    'name'          : getCellValue(cells[0]),
                    'age'           : getCellValue(cells[1]),
                    'time'          : getCellValue(cells[2]),
                    'appearances'   : getCellValue(cells[3]),
                    'medals'        : getCellValue(cells[4]),
                    'country'       : getCellValue(cells[5])
                });
            }

            let sortedRows = cellData.sort(function(c1, c2){
                let v1 = c1[SORT_MAPPING[columnIndex]];
                let v2 = c2[SORT_MAPPING[columnIndex]];
                if(SORT_TYPE['string'].includes(columnIndex)){
                    return ORDER_TYPE[order] * v1.localeCompare(v2);
                }
                else {
                    if(SORT_TYPE['float'].includes(columnIndex)){
                        v1 = parseFloat(v1);
                        v2 = parseFloat(v2);
                    }
                    else {
                        v1 = parseInt(v1);
                        v2 = parseInt(v2);
                    }
                    if(v1 < v2) return ORDER_TYPE[order] * -1;
                    else if(v1 > v2) return ORDER_TYPE[order] * 1;
                    else return 0;
                }
            });
            return sortedRows;
        }

        /**
         * Gets the new values for each row after sort.
         * @param {*} sortedRows - An array-like object containing the data of each row.
         */
        function sortRows(sortedRows){
            for(let i=0; i<rows.length; i++){
                updateRowValues(rows.item(i), sortedRows[i]);
            }
        }

        /**
         * Updates a row's value with the new values.
         * @param {*} row - The table row whose values are to be updated.
         * @param {*} newRow - An array with the new values.
         */
        function updateRowValues(row, newRow){
            let cells = row.children;
            for(let i=0; i<cells.length;  i++){
                let inputField = cells.item(i).firstChild;
                inputField.value = newRow[SORT_MAPPING[i]];
            }
        }

        /**
         * Sorts the whose table by a column.
         * @param {*} columnIndex - The index of the column to be used in sorting.
         * @param {*} order - The sorting order. Possible values: asc, desc.
         */
        function sortTableByColumn(columnIndex, order="asc"){
            let sortedRows = getSortedRowsByColumn(columnIndex, order);
            sortRows(sortedRows);
        }

        /**
         * Sorts the table and updates header attributes and classes.
         */
        function performSorting(sortHeader, table){
            let headers = table.querySelectorAll('.uom-sort-header');
            for(header of headers){
                header.classList.remove('uom-active-sort');
            }
            sortHeader.classList.add('uom-active-sort');

            let order = sortHeader.getAttribute("order");
            sortTableByColumn(sortHeader.cellIndex, order);

            if(order == 'asc'){
                sortHeader.setAttribute('order', 'desc');
            } 
            else {
                sortHeader.setAttribute('order', 'asc');
            }
        }

        // Calling all of the above.
        setSortHeaders();
        table.addEventListener('click', function(event){
            let elem = event.target;
            if(elem.classList.contains('uom-sort-header')){
                performSorting(elem, this);
            }
        });
    }

    /**
     * Gets the value of the input field within the cell.
     * @param {*} cell - The table cell to be used to get its value.
     * @returns The value of input field of cell in string representation.
     */
            function getCellValue(cell){
            return cell.firstChild.value;
        }

    /**
     * Adds listeners to monitor change events in table input cells and perform data validations on the fly.
     * @param {*} table - The HTML table in which the event listeners will be added.
     */
    function addInputChangeListeners(table){
        table.addEventListener('change', function(event){
            if(event.target.classList.contains('uom-field')){
                let inputField = event.target;
                let currentCell = inputField.parentNode;
                if(shouldBeString(currentCell)){
                    if(!isValidString(inputField.value)){
                        inputField.value = '-';
                    }
                }
                if(shouldBeInt(currentCell)){
                    if(!isValidInt(inputField.value)){
                        inputField.value = '0';
                    }
                }
                if(shouldBeFloat(currentCell)){
                    if(!isValidFloat(inputField.value)){
                        inputField.value = '0.0';
                    }
                }
                updateStats(table);
                updateStorageTableData(table);
            }
        });
    }

    /**
     * Check if a cell should be of type 'string'.
     * @param {*} cell - The cell to be checked.
     * @returns true if it's a string or false if it's not.
     */
    function shouldBeString(cell){
        return SORT_TYPE['string'].includes(cell.cellIndex);
    }

    /**
     * Check if the value is a valid string that contains only letters and not numbers.
     * @param {*} value - The value to be checked.
     * @returns true if it's valid, or false if it's not.
     */
    function isValidString(value){
        if(value.trim().length == 0){
            return false;
        }
        for(let i=0; i<value.length; i++){
            if(!isNaN(parseInt(value[i]))){
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the specified cell should hold a numeric value.
     * @param {*} cell - The cell to be checked.
     * @returns true if it should be number, or false if it's not.
     */
    function shouldBeInt(cell){
        return SORT_TYPE['int'].includes(cell.cellIndex);
    }

    /**
     * Check if value is a valid number.
     * @param {*} value - The value to be checked.
     * @returns true if it's valid or false if it's not.
     */
    function isValidInt(value){
        return !isNaN(parseInt(value));
    }

     /**
     * Checks if the specified cell should hold a numeric value.
     * @param {*} cell - The cell to be checked.
     * @returns true if it should be number, or false if it's not.
     */
    function shouldBeFloat(cell){
        return SORT_TYPE['float'].includes(cell.cellIndex);
    }
    
    /**
     * Check if value is a valid number.
     * @param {*} value - The value to be checked.
     * @returns true if it's valid or false if it's not.
     */
    function isValidFloat(value){
        return !isNaN(parseFloat(value));
    }

    /**
     * Helper function to get the tag name of a HTML element.
     * @param {*} elem - The HTML element to get the tag name from.
     * @returns The elements tag name in lowercase.
     */
    function getLowerTagName(elem){
        return elem.tagName.toLowerCase();
    }

    /**
     * Check if an element is table.
     * @param {*} elem - The element to be checked.
     * @returns true if it's table or false if it's not.
     */
    function isTable(elem){
        return getLowerTagName(elem) == 'table';
    }

    /**
     * Get all table rows in body section.
     * @param {*} table - The HTML table to get the body rows from.
     * @returns An HTMLCollection containing all row elements of body.
     */
    function getBodyRows(table){
        let tbody = table.querySelector('tbody');
        let rows = tbody.getElementsByTagName('tr');
        return rows;
    }

    /**
     * Gets all table data and stores them in localStorage.
     * @param {*} table - The HTML table to get the data from. 
     */
    function updateStorageTableData(table){
        let rows = getBodyRows(table);
        let tableData = [];
        for(row of rows){
            let cells = row.children;
            tableData.push({
                'name'          : getCellValue(cells[0]),
                'age'           : getCellValue(cells[1]),
                'time'          : getCellValue(cells[2]),
                'appearances'   : getCellValue(cells[3]),
                'medals'        : getCellValue(cells[4]),
                'country'       : getCellValue(cells[5])
            });
        }
        localStorage.setItem('table_data', JSON.stringify(tableData));
    }

    /**
     * Show or hide a specific table column
     * @param {*} index - The index of the column to toggle.
     */
    function toggleColumn(index){
        let columns = document.querySelectorAll('*[column="' + index + '"]');
        for(column of columns){
            column.classList.toggle('column-hide');
        }
    }

    /**
     * Create the column filter section.
     */
    function createColumnFilters(){
        let columnFilters = document.createElement('div');
        let columnInfo = createColumnInfo();
        let columnSelectors = createColumnSelectors();
        columnFilters.classList.add('table-column-selector');
        columnFilters.appendChild(columnInfo);
        columnFilters.appendChild(columnSelectors);
        columnFilters.addEventListener('change', (event) => {
            let tagName = getLowerTagName(event.target);
            if(tagName == 'input' || tagName == 'label'){
                let columnIndex = parseInt(event.target.value.replace('column',''));
                toggleColumn(columnIndex);
            }
        });
        document.body.appendChild(columnFilters);
    }

    /**
     * Create the column filter info header.
     * @returns A HTML element containing the table column info.
     */
    function createColumnInfo(){
        let infoElem = document.createElement('p');
        infoElem.classList.add('table-column-info');
        infoElem.innerHTML = "Show / Hide columns";
        return infoElem;
    }

    /**
     * Create all column selector checkboxes.
     * @returns HTML elements of selectors.
     */
    function createColumnSelectors(){
        let divSelectorElem = document.createElement('div');
        divSelectorElem.classList.add('column-selectors');
        [1,3,4,5].forEach((elem) => {
            let columnSelector = createColumnSelector(elem+1, SORT_MAPPING[elem]);
            divSelectorElem.appendChild(columnSelector);
        });
        return divSelectorElem;
    }

    /**
     * Create a column filter for a specific table column.
     * @param {*} index - The column index.
     * @param {*} value - The value of checkbox label.
     * @returns A div element containing checkbox.
     */
    function createColumnSelector(index, value){
        let columnSelector = document.createElement('div');
        let checkbox = createSelectorCheckbox(index);
        let label = createLabelSelector(index, value);
        columnSelector.appendChild(checkbox);
        columnSelector.appendChild(label);
        columnSelector.classList.add('column-selector');
        return columnSelector;
    }

    /**
     * Creates a checkbox.
     * @param {*} index - The table column index to apply the checkbox filter.
     * @returns A checkbox element.
     */
    function createSelectorCheckbox(index){
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'column' + index);
        checkbox.setAttribute('value', 'column' + index);
        checkbox.setAttribute('checked', 'checked');
        checkbox.classList.add('column-checkbox');
        return checkbox;
    }

    /**
     * Creates a label next to the filter checkbox.
     * @param {*} index - The table column index.
     * @param {*} value - The name of the label.
     * @returns A label element.
     */
    function createLabelSelector(index, value){
        let label = document.createElement('label');
        label.setAttribute('for', 'column' + index);
        label.classList.add('checkbox-label');
        label.innerHTML = value;
        return label;
    }

    // Call init function.
    init();
}