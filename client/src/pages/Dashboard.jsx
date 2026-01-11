import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit2, CheckCircle, Circle, Search, Filter } from 'lucide-react';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, data);
            } else {
                await api.post('/tasks', data);
            }
            fetchTasks();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await api.put(`/tasks/${task._id}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (task = null) => {
        setEditingTask(task);
        if (task) {
            setValue('title', task.title);
            setValue('description', task.description);
            setValue('status', task.status);
        } else {
            reset();
            setValue('status', 'pending');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        reset();
    };

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                </button>
            </header>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div key={task._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 truncate" title={task.title}>{task.title}</h3>
                                    <button onClick={() => toggleStatus(task)} className={`text-${task.status === 'completed' ? 'green' : 'gray'}-500 hover:text-${task.status === 'completed' ? 'green' : 'gray'}-700`}>
                                        {task.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-3 min-h-[3rem]">{task.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {task.status}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openModal(task)} className="text-indigo-600 hover:text-indigo-900 p-1">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteTask(task._id)} className="text-red-600 hover:text-red-900 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No tasks found.
                    </div>
                )}
            </div>

            {/* Modal - Same as before */}
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    {editingTask ? 'Edit Task' : 'New Task'}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            {...register("title", { required: true })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            {...register("description")}
                                            rows="3"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            {...register("status")}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
