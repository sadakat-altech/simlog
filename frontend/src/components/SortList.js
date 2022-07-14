import { useEffect, useState } from "react";

const SortList = ({sortOptions, list, setSortedList}) => {

    const [selectedSort, setSelectedSort] = useState();
    const [selectedOrder, setSelectedOrder] = useState(1);

    useEffect(()=>{
        if(list){
            if(sortOptions.defaultValue){
                sortList(sortOptions.defaultValue.prop, sortOptions.defaultValue.order);
                setSelectedSort(sortOptions.defaultValue.prop);
                setSelectedOrder(sortOptions.defaultValue.order);
            }else{
                sortList(sortOptions.sorts[0].prop, 1);
                setSelectedSort(sortOptions.sorts[0].prop);
                setSelectedOrder(1);
            }
        }
    },[sortOptions])

    const filterElements = sortOptions.sorts.map(ele => (<option key={ele.prop} selected={ele.prop === selectedSort} value={ele.prop}>{ele.value}</option>));    

    const sortList =  (sort, order) => {
        const copy = [...list];
        copy.sort((a,b) => {
            if(a[sort] < b[sort]){
                return -order;
            }else if(a[sort] > b[sort]){
                return order;
            }else{
                return 0;
            }
        });
        setSortedList(copy);
    }

    return (
    <div className="sort1">
        <select onChange={e => setSelectedSort(e.target.value)}>
            {filterElements}
        </select>
        <select onChange={e => setSelectedOrder(e.target.value)}>
            <option selected={selectedOrder === 1} value={1}>Asc</option>
            <option selected={selectedOrder === -1} value={-1}>Desc</option>
        </select>
        <button className="btn btn-primary" onClick={() => sortList(selectedSort, selectedOrder)}>Apply</button>
    </div>
    );
}

export default SortList;