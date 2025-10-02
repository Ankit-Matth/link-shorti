"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
    Eye, CheckCircle2, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight,
    Link as LinkIcon, Sparkles, Wand2, Search, Copy, Check, Trash2, Edit, ExternalLink,
    Wallet, Hourglass, CircleCheck, ThumbsUp, XCircle, Undo2, Info, Menu
} from 'lucide-react';

const SHORTENER_DOMAIN = process.env.NEXT_PUBLIC_SHORTENER_DOMAIN || 'https://yourdomain.com';

const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return 'N/A';
    const numericNum = parseFloat(num);
    if (isNaN(numericNum)) return 'N/A';
    
    if (numericNum >= 1000000) return (numericNum / 1000000).toFixed(1) + 'M';
    if (numericNum >= 1000) return (numericNum / 1000).toFixed(1) + 'K';
    return numericNum.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(parseFloat(amount))) return '$0.00';
    return `${parseFloat(amount).toFixed(2)}`;
};

const StatCard = ({ icon, title, value, change, changeType, gradientColors }) => {
    const IconComponent = icon;
    const isPositive = changeType === 'positive';
    const displayValue = value === undefined || value === null || value === 'N/A' ? '0' : value;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <span className="text-slate-500 font-medium">{title}</span>
                    <span className="text-3xl font-bold text-slate-800 mt-1">{displayValue}</span>
                </div>
                <div className={`rounded-full p-3 ${gradientColors}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className={`flex items-center gap-1 text-sm mt-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{change || '0.0%'} vs. last month</span>
            </div>
        </div>
    );
};

const Statistics = ({ statistics: data }) => {
    const statistics = data || {};
    const dailyStats = statistics.dailyStats || [];
    const tableData = useMemo(() => {
        return dailyStats
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 15)
            .map(stat => ({
                date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                properViews: formatNumber(stat.properViews),
                earnings: formatCurrency(stat.earnings),
                dailyCPM: formatCurrency(stat.dailyCPM), 
            }));
    }, [dailyStats]);

    const chartPoints = dailyStats
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(stat => stat.properViews || 0);

    const totalImpressions = formatNumber(statistics.totalImpressions);
    const totalProperViews = formatNumber(statistics.totalProperViews);
    const totalEarnings = formatCurrency(statistics.totalEarnings);
    const averageCPM = formatCurrency(statistics.averageCPM);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Statistics</h2>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
                <StatCard icon={Eye} title="Total Impressions" value={totalImpressions} change="12.5%" changeType="positive" gradientColors="bg-gradient-to-br from-blue-400 to-blue-600" />
                <StatCard icon={CheckCircle2} title="Proper Views" value={totalProperViews} change="8.2%" changeType="positive" gradientColors="bg-gradient-to-br from-green-400 to-green-600" />
                <StatCard icon={DollarSign} title="Total Earnings" value={totalEarnings} change="1.5%" changeType="negative" gradientColors="bg-gradient-to-br from-purple-400 to-purple-600" />
                <StatCard icon={BarChart3} title="Average CPM" value={averageCPM} change="3.1%" changeType="positive" gradientColors="bg-gradient-to-br from-orange-400 to-orange-600" />
            </div>

                        <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Views Overview (Last {chartPoints.length} Days)</h3>
                <div className="h-80 w-full rounded-lg p-4">
                    <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <g stroke="#e2e8f0" strokeWidth="1">
                             <line x1="0" y1="0" x2="0" y2="200"></line>
                             <line x1="0" y1="200" x2="500" y2="200"></line>
                             <line x1="0" y1="150" x2="500" y2="150" strokeDasharray="2,5"></line>
                             <line x1="0" y1="100" x2="500" y2="100" strokeDasharray="2,5"></line>
                             <line x1="0" y1="50" x2="500" y2="50" strokeDasharray="2,5"></line>
                         </g>
                          <path d="M 0,150 C 50,120 80,80 125,90 S 200,150 250,130 S 350,50 400,60 S 480,100 500,80" fill="url(#areaGradient)" stroke="none" />
                          <path d="M 0,150 C 50,120 80,80 125,90 S 200,150 250,130 S 350,50 400,60 S 480,100 500,80" fill="none" stroke="url(#lineGradient)" strokeWidth="3" />
                    </svg>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <h3 className="text-xl font-semibold text-slate-800 p-6">Recent Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 bg-slate-50/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Views</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">CPM</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-slate-700">{row.date}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700">{row.properViews}</td>
                                    <td className="p-4 whitespace-nowrap font-medium text-blue-600">{row.dailyCPM}</td>
                                    <td className="p-4 whitespace-nowrap font-bold text-green-600">{row.earnings}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tableData.length === 0 && <div className="text-center py-10 text-slate-500"><p>No daily statistics found.</p></div>}
                </div>
            </div>
        </div>
    );
};

const LinkCard = ({ link, onCopy, onDelete, isDeleting }) => {
    const [copied, setCopied] = useState(false);
    const fullShortUrl = `${SHORTENER_DOMAIN}/${link.shortUrl}`;

    const handleCopyClick = () => {
        onCopy(fullShortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-grow min-w-0">
                    {link.alias && <p className="text-sm font-semibold text-purple-600">Alias: {link.alias}</p>}
                    <p className="text-sm text-slate-500 truncate">{link.originalUrl}</p>
                    <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-600 hover:underline flex items-center gap-1">
                        {fullShortUrl.replace(/^https?:\/\//, '')}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex items-center gap-4 text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                    <div className="text-center">
                        <p className="font-bold text-slate-800">{formatNumber(link.clicks)}</p>
                        <p className="text-xs">Clicks</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCopyClick} className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Copy link" disabled={isDeleting}>
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button onClick={() => onDelete(link._id)} className="p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50" aria-label="Delete link" disabled={isDeleting}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageLinks = ({ links: fetchedLinksArray, fetchData }) => {
    const { data: session } = useSession();
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [links, setLinks] = useState(fetchedLinksArray || []);

    useEffect(() => {
        setLinks(fetchedLinksArray || []);
    }, [fetchedLinksArray]);

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!session?.user?.email) {
            setIsError(true);
            setMessage('Authentication error: Please sign in again.');
            return;
        }
        const urlRegex = /^(https?:\/\/)[\w\-\.\/:]+\.[\w\-\.\/:]+([a-zA-Z0-9\-\.\/?%=&]*)?$/;
        if (!longUrl || !urlRegex.test(longUrl)) {
            setIsError(true);
            setMessage('Please enter a valid URL.');
            return;
        }
        const safeAlias = alias ? alias.trim().replace(/[^a-zA-Z0-9\s-]/g, '').toLowerCase() : '';
        setIsSubmitting(true);
        setIsError(false);
        setMessage('');
        try {
            const response = await fetch('/api/create-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalUrl: longUrl, alias: safeAlias, userEmail: session.user.email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create link.');
            setLinks([data.newLink, ...links]);
            setLongUrl('');
            setAlias('');
            setMessage(`Link created!`);
        } catch (error) {
            setIsError(true);
            setMessage(error.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };
    
    const handleCopy = (fullShortUrl) => navigator.clipboard.writeText(fullShortUrl);
    
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        setIsDeleting(true);
        try {
            const response = await fetch('/api/delete-link', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkId: id, userEmail: session.user.email }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete link.');
            }
            setLinks(links.filter(link => link._id !== id));
            setMessage('Link deleted.');
        } catch (error) {
            setIsError(true);
            setMessage(error.message || 'Deletion failed.');
        } finally {
            setIsDeleting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const filteredLinks = useMemo(() => {
        return links.filter(link => {
            const search = searchTerm.toLowerCase();
            return (
                link.originalUrl?.toLowerCase().includes(search) ||
                link.shortUrl?.toLowerCase().includes(search) ||
                link.alias?.toLowerCase().includes(search)
            );
        });
    }, [links, searchTerm]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Manage Links</h2>

            <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
                <form onSubmit={handleShorten}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="Enter long URL" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
                        </div>
                        <div className="relative">
                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom alias (optional)" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90 disabled:opacity-50" disabled={isSubmitting}>
                            <Wand2 className="w-5 h-5" />
                            {isSubmitting ? 'Shortening...' : 'Shorten'}
                        </button>
                        {message && <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 pb-4">
                    <h3 className="text-xl font-semibold text-slate-800">Your Links ({links.length})</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search links..." className="w-full sm:w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                
                <div className="space-y-4 p-6 pt-2">
                    {filteredLinks.length > 0 ? (
                        filteredLinks.map(link => <LinkCard key={link._id} link={link} onCopy={handleCopy} onDelete={handleDelete} isDeleting={isDeleting} />)
                    ) : (
                        <div className="text-center py-10 text-slate-500"><p>No links found.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BalanceCard = ({ icon: Icon, title, amount, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6 border-slate-200/80">
        <div className={`p-4 rounded-full ${color}`}><Icon className="w-7 h-7 text-white" /></div>
        <div>
            <p className="text-slate-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(amount)}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusStyles = {
        Pending: { icon: Hourglass, color: 'text-orange-600 bg-orange-100' },
        Approved: { icon: ThumbsUp, color: 'text-blue-600 bg-blue-100' },
        Complete: { icon: CircleCheck, color: 'text-green-600 bg-green-100' },
        Cancelled: { icon: XCircle, color: 'text-slate-600 bg-slate-100' },
        Returned: { icon: Undo2, color: 'text-red-600 bg-red-100' },
    };
    const { icon: Icon, color } = statusStyles[status] || statusStyles.Cancelled;
    return (
        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium ${color}`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
};

const Withdrawal = ({ withdrawal: data, fetchData }) => {
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const MINIMUM_WITHDRAWAL_AMOUNT = 5.00;

    const { availableBalance = 0, pendingBalance = 0, totalWithdrawn = 0, history = [] } = data || {};

    const handleWithdraw = async () => {
        if (availableBalance < MINIMUM_WITHDRAWAL_AMOUNT) {
            setIsError(true);
            setMessage(`Minimum withdrawal is ${formatCurrency(MINIMUM_WITHDRAWAL_AMOUNT)}.`);
            return;
        }
        setIsWithdrawing(true);
        try {
            const response = await fetch('/api/req-withdrawal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: session.user.email, amount: availableBalance }),
            });
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.error || 'Request failed.');
            fetchData(session.user.email);
            setMessage('Withdrawal request sent!');
        } catch (error) {
            setIsError(true);
            setMessage(error.message);
        } finally {
            setIsWithdrawing(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Withdrawal</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
                <BalanceCard icon={Wallet} title="Available" amount={availableBalance} color="bg-green-500" />
                <BalanceCard icon={Hourglass} title="Pending" amount={pendingBalance} color="bg-orange-500" />
                <BalanceCard icon={CircleCheck} title="Total Withdrawn" amount={totalWithdrawn} color="bg-blue-500" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <button onClick={handleWithdraw} disabled={availableBalance < MINIMUM_WITHDRAWAL_AMOUNT || isWithdrawing} className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isWithdrawing ? 'Processing...' : 'Withdraw'}
                    </button>
                    <div>
                        <p className="text-slate-600">Minimum withdrawal amount is <strong className="text-slate-800">{formatCurrency(MINIMUM_WITHDRAWAL_AMOUNT)}</strong>.</p>
                        {message && <p className={`mt-1 text-sm font-semibold ${isError ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-slate-800 p-6">Withdrawal History</h3>
                <div className="space-y-2 p-6 pt-2">
                    {history.length > 0 ? history.map(item => (
                        <div key={item.withdrawalId} className="bg-slate-50 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
                            <div className="font-mono text-sm text-slate-500 sm:col-span-1">#{item.withdrawalId}</div>
                            <div className="text-slate-700 sm:col-span-1">{new Date(item.date).toLocaleDateString()}</div>
                            <div className="sm:col-span-1"><StatusBadge status={item.status} /></div>
                            <div className="font-bold text-slate-800 sm:col-span-1 sm:text-right">{formatCurrency(item.totalAmount)}</div>
                        </div>
                    )) : <div className="text-center py-10 text-slate-500"><p>No history found.</p></div>}
                </div>
            </div>

            <div className="mt-8 p-6 bg-slate-100 rounded-2xl">
                <h4 className="font-semibold text-slate-700 mb-3">Status Descriptions</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                     <li className="flex items-start gap-3"><StatusBadge status="Pending" /><span>- The payment is being checked by our team.</span></li>
                     <li className="flex items-start gap-3"><StatusBadge status="Approved" /><span>- The payment has been approved and is waiting to be sent.</span></li>
                     <li className="flex items-start gap-3"><StatusBadge status="Complete" /><span>- The payment has been successfully sent to your payment account.</span></li>
                     <li className="flex items-start gap-3"><StatusBadge status="Cancelled" /><span>- The payment has been cancelled by your request or our team.</span></li>
                     <li className="flex items-start gap-3"><StatusBadge status="Returned" /><span>- The payment has been returned to your account by the payment gateway.</span></li>
                </ul>
            </div>
        </div>
    );
};

const Refferals = () => (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
        <h2 className='text-3xl font-bold mb-6 text-slate-800'>Referrals</h2>
        <div className='bg-white p-8 rounded-2xl shadow-md'>
            <p className='text-lg font-medium text-slate-700'>Coming soon!</p>
        </div>
    </div>
);

export const MainContent = ({ activeContent, toggleSidebar, statistics, links, withdrawal, fetchData, isLoading, error }) => {
    const pageTitles = {
        statistics: 'Statistics',
        'manage-links': 'Manage Links',
        withdrawal: 'Withdrawal',
        refferals: 'Referrals',
        default: 'Dashboard'
    };
    
    const contentMap = useMemo(() => ({
        statistics: <Statistics statistics={statistics} />,
        'manage-links': <ManageLinks links={links} fetchData={fetchData} />, 
        withdrawal: <Withdrawal withdrawal={withdrawal} fetchData={fetchData} />,
        refferals: <Refferals />,
    }), [statistics, links, withdrawal, fetchData]);

    return (
        <div className="h-screen flex flex-col">
            <header className="flex-shrink-0 flex w-full h-20 items-center justify-between px-4 sm:px-6 bg-white border-b sticky top-0 z-10">
                <div className="flex items-center min-w-0">
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 mr-4 md:hidden" aria-label="Open sidebar">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{pageTitles.default}</h1>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="whitespace-nowrap rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-400 shadow-md">
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="overflow-y-auto">
                {isLoading && <div className="text-center py-20"><p>Loading...</p></div>}
                {error && <div className="text-center py-20 text-red-500"><p>{error}</p></div>}
                {!isLoading && !error && (contentMap[activeContent] || <div className='p-6 text-center'><p>Select a section</p></div>)}
            </main>
        </div>
    );
};