import AppBar from './AppBar';

const contentStyle = {
    minHeight: 'calc(100vh - 56px)', // base: 56px (h-14)
    background: '#f5f5f5',
};

const DefaultLayout = ({ children }) => (
    <div className="h-screen flex flex-col">
        <AppBar />
        <main style={contentStyle} className="app-main">
            {children}
        </main>
    </div>
);

export default DefaultLayout;
