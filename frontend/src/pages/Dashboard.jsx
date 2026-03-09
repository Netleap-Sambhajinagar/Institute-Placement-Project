const StatCard = ({ label, value }) => (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[160px] w-full">
        <p className="text-gray-500 font-medium text-sm">{label}</p>
        <h3 className="text-4xl font-bold text-slate-800 mt-4">{value}</h3>
    </div>
);

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
            <StatCard label="enrolled courses" value="01" />
            <StatCard label="jobs applied" value="0" />
            <StatCard label="internshps applied" value="0" />
        </div>
    );
};

export default Dashboard;