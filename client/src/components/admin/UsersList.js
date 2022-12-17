import React,{useState,useEffect} from 'react'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { useDispatch,useSelector } from 'react-redux';
import { getAllUsers,clearErrors,deleteUser } from '../../actions/userActions';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MDBDataTable } from 'mdbreact'
import { DELETE_USER_RESET } from '../../constants/userConstants';
const UsersList = ({history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {loading,error,users} = useSelector(state=>state.allUsers)
    const { isDeleted } = useSelector(state => state.user)
    console.log("final deleted",isDeleted);
    useEffect(() => {
        console.log("im in useEffect");
        dispatch(getAllUsers())
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
    if (isDeleted) {
        alert.success('User deleted successfully');
        history.push('/admin/users');
        dispatch({ type: DELETE_USER_RESET })
    }
}, [error,alert,dispatch,isDeleted,history])
const deleteUserHandler = (id) => {
    dispatch(deleteUser(id))
}
    const setUsers = ()=>{
      const data = {
          columns:[
              {
                  label:'user ID',
                  field:'id',
                  sort:'asc'
              },{
                  label:'Name',
                  field:'name',
                  sort:'asc'
              },{
                label:'Email',
                field:'email',
                sort:'asc'
            },
            {
                label:'Role',
                field:'role',
                sort:'asc'
            },
            {
                label:'Actions',
                field:'actions',
                
            }
          ],
          rows:[

          ]
        }
        users.forEach(user=>{
            data.rows.push({
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                actions:<><Link to={`/admin/user/${user._id}`} className="btn btn-primary">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button onClick={() => deleteUserHandler(user._id)} className="btn btn-danger py-1 px-2 ml-2">
                <i className="fa fa-trash"></i>    
                </button></>
            })
        })
        return data;
    }
    return (
        <>
        <MetaData title={'All Users'} />
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <>
                    <h1 className="my-5">All Users</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable
                            data={setUsers()}
                            className="px-3"
                            bordered
                            striped
                            hover
                        />
                    )}

                </>
            </div>
        </div>

    </>
    )
}

export default UsersList
