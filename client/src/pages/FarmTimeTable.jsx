import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showModal, closeModal } from '../store/ModalSlice';
import { initDate } from '../store/FormSlice';
import ModalContainer from '../components/Modal'
import FarmPeriod from '../components/FarmPeriod';
import UpdatePeriod from '../components/UpdatePeriod';
import FarmFormat from '../components/FarmFormat';
import FarmTime from '../components/FarmTime';
import Pagination from '../components/TimeTablePagination';
import styled from 'styled-components';
import { ConfirmButton, DeleteButton, ContentContainer, NormalButton, SubmitButton, Input } from '../styles/Styled';
import Moment from 'moment';

import * as API from '../lib/userApi';

const Subject = styled.h2`
	text-align: center;
	margin-bottom: 4%;
`;
const ModalTitle = styled(Subject)`
    font-size : 1.5rem;
`   
const TimeTableList = styled(ContentContainer)`
    border : 2px lightgray solid;
    border-radius : 10px;
    padding 15px;
    margin : 2% 0;
`;
const FarmImg = styled.img`
    margin-right: 20px;
    width: 140px;
    height: 120px;
    object-fit : cover;
`;
const TimTableContent = styled.div`
    display:block
    width: 100%;
`; 
const TimTableItem = styled.div`
    display:flex;
`;
const AddTimTable = styled(NormalButton)`
    display:block;
    margin-left:auto;
    margin-bottom:10px;
`;
const TimeTableButtons = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:auto;
`;
const UpdateButton =styled(ConfirmButton)`
    display: block;
    width: 100%;
    + button {
        margin-left: 0px;
    }
    :not(:last-child) {
        margin-bottom:10px;
    }
`;
const DelButton = styled(DeleteButton)`
    display: block;
    width: 100%;
    + button {
        margin-left: 0px;
    }
`;
const H3 = styled.h3`
    margin : 30px 0 10px;
    font-size : 1.1rem;
`;
const SubmitBtn = styled(SubmitButton)`
    display: block;
    width: 100%;
    margin-top : 7%;
`;
const FailAnnouncement = styled.p`
	text-align: center;
	margin-top: 5rem;
`;
const Div = styled(ContentContainer)`
    margin : 2% 0;
`
const CommonInput = styled(Input)`
    display : block;
    width: 100%;
    font-size : 0.9rem;
`;
const CostInput = styled(CommonInput)``;

//memo ?????? : TimeTable
const TimeTable = ()=>{
    let farmRegistraion = true;
    const [timeTable, setTimeTable] = useState([]);
    const [postData, setPostData] = useState({});
    const [date, setDate] = useState([]);
    const [cost, setCost] = useState('');
    const [maxHeadCount, setMaxHeadCount] = useState([]);

    // memo ??????: ????????? ??????
    const [target,setTarget] = useState('');

    // memo ?????? : ??????????????????
    const [page, setPage] = useState(1);    
    const [lastId, setLastId] = useState([0]);
    const [first,setFirst] = useState(1);
    const [last,setLast] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);

    const limit = 20;
    const perpage = 5;
    const pageCount = limit / perpage;
    const offset = ((page-1) - (pageCount * pageGroup) )* perpage;

    const dispatch = useDispatch();
    const modalOpen = useSelector(({modal}) => modal);

    const fetchData = async () => {
        try {
            await API.get(`/api/farmers/farmInfo`)
            await API.get(`/api/timetables/owner?lastId=${lastId[pageGroup]}&limit=${limit}`).then(
                (res) => {
                    const data = res.data;
                    console.log(data);
                    console.log(lastId[pageGroup]);
                    setTimeTable([...data]);
                }
            );
        }
        catch(e){
            if (e.response.data.message ==='??????????????? ????????? ????????? ????????????.'){
                farmRegistraion = false;
            }   
            return;
        }
    };

    const handleSubmit = async(e , target) =>{   
        e.preventDefault();
        //memo ?????? : ??????????????? ??????
        if (target === ''){ 
            if(postData.timeList.length < 1 || cost < 1 || !postData.startDate || !postData.endDate) {
                alert('?????? ?????? ???????????? ??????????????????');
                return;
            };

            const {timeList,startDate,endDate} = postData;
            const d1 = Moment(startDate,'YYYY-MM-DD');
            const d2 = Moment(endDate,'YYYY-MM-DD');
            const diffDate = d2.diff(d1,'days');
            let date = d1;

            for (let i = 0; i <= diffDate ; i++){
                for (let j = 0; j< timeList.length; j++){
                    const start_time = timeList[j][0];
                    const end_time = timeList[j][1];
                    const personnel = maxHeadCount[j];
                    try {
                        await API.post('/api/timetables',{
                            'date': date,
                            'personnel':personnel,
                            'price':cost,
                            'start_time':start_time,
                            'end_time':end_time
                        });
                    }
                    catch(e){
                        console.log(e);
                    }
                }
                date = d1.add(1, 'days'); 
            }
        }
        //memo ?????? : ??????????????? ??????
        else {
            try {
                const res = await API.put(`/api/timetables/${target}`,{
                    'date': date[0],
                    'personnel':maxHeadCount[0],
                    'price':cost,
                    'start_time':postData.timeList[0][0],
                    'end_time':postData.timeList[0][1]
                });
            }
            catch(e){
                console.log(e);
            }
        }
        alert(`??????????????? ${Isupdate()}??????`);
        dispatch(closeModal());
        dispatch(initDate());
        resetForm();
        fetchData();
    };
    
    const LiftingHeadCount = state =>{
        setMaxHeadCount([...maxHeadCount,...state]);
    };
    const LiftingDate = state =>{
        setDate([state,...date]);
    };
    const stateLifting = state => {
        setPostData({...postData,...state});
    };

    const onTimeTableDelete = async(id) => {
        const result = window.confirm('?????????????????????????');
        if(result){
            await API.delete(`/api/timetables/${id}`);
            fetchData();
        }
    };
    const onTimeTableUpdate = (id)=>{
        resetForm();
        setTarget(id);
        dispatch(showModal());
    };

    const handleCost =  (e) =>{
        const value = e.target.value;
        const onlyNumber = value.replace(/[^0-9]/g, '')
        setCost(onlyNumber)
    }
    const handleCreate = () => {
        if(farmRegistraion){ 
            resetForm();
            dispatch(showModal());
            return;
        }
        alert('????????? ?????? ??????????????????');
    };
    const Isupdate = () => {
        return (target === '' ? '??????' : '??????');
    };

    const resetForm  = () => {
        setDate('');
        setCost('');
        setTarget('');
    };

    useEffect (() => {
        console.log(lastId);
        fetchData();
    }, [lastId,pageGroup]);


    return (
        <>
        <FarmFormat>
            <Subject>???????????????</Subject>
            <AddTimTable type='button' onClick = {handleCreate}>????????????</AddTimTable>
            { timeTable.length > 0 ? 
                    timeTable.slice(offset, offset + perpage).map((table,idx) =>{
                        const {id, url, date, start_time, end_time, price, personnel} = table;
                        console.log(url);
                        return(
                            <TimeTableList key={idx}>
                                <TimTableItem>
                                    <FarmImg src={url.split(",")[0]} alt='???????????????'></FarmImg>
                                    <TimTableContent>
                                        <div>
                                            <span>?????? : </span>
                                            <span>{date}</span>
                                        </div>
                                        <div>
                                            <span>???????????? : </span>
                                            <span>{start_time.slice(0,5)}</span>
                                        </div>
                                        <div>
                                            <span>??????????????? : </span>
                                            <span>{end_time.slice(0,5)}</span>
                                        </div>
                                        <div>
                                            <span>?????? : </span>
                                            <span>{price.toLocaleString('ko-KR')}</span>  
                                        </div>
                                        <div>
                                            <span>????????? : </span>
                                            <span>{personnel}</span>
                                        </div>
                                    </TimTableContent>
                                    <TimeTableButtons>
                                        <UpdateButton type='button' onClick={()=>onTimeTableUpdate(id)}>??????</UpdateButton>
                                        <DelButton type='button' onClick={()=>onTimeTableDelete(id)}>??????</DelButton>
                                    </TimeTableButtons>
                                </TimTableItem>
                            </TimeTableList>
                        )
                    }) 
                    : (<FailAnnouncement>?????????????????? ???????????????</FailAnnouncement>) 
            }
            { timeTable.length > 0 
                && <Pagination pageCount={pageCount} timeTable={timeTable} 
                perpage={perpage} page={page} setPage={setPage}
                pageGroup={pageGroup} setPageGroup={setPageGroup} 
                first={first} setFirst={setFirst} last={last} setLast={setLast} 
                lastId = {lastId} setLastId={setLastId}/>
            }
        </FarmFormat>

        { modalOpen && <ModalContainer  w='35%' h='77%'>
                <form onSubmit={(e) => handleSubmit(e , target)}>
                    <ModalTitle>??????????????? {Isupdate()}</ModalTitle>
                    <Div>
                        <H3>?????? ??????</H3>
                        {target==='' 
                            ? <FarmPeriod onStateLifting ={stateLifting}/>  
                            : <UpdatePeriod timeTable={timeTable} target={target} LiftingDate ={LiftingDate}/>
                        }
                    </Div>
                    <Div>
                        <H3>?????? ??????</H3>
                        <FarmTime onStateLifting={stateLifting} LiftingHeadCount={LiftingHeadCount} target={target}></FarmTime>
                    </Div>
                    <Div>
                        <H3>?????? ??????</H3>
                        <CostInput type='text' placeholder='??????????????? ???????????????' value={cost} onChange={handleCost}></CostInput>
                    </Div>
                    <SubmitBtn type='submit'>{Isupdate()}</SubmitBtn>
                </form>
                </ModalContainer>
        }
        </>
    )
}

export default TimeTable;