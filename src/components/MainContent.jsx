"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
    Eye, CheckCircle2, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight,
    Link as LinkIcon, Sparkles, Wand2, Search, Copy, Check, Trash2, Edit, ExternalLink,
    Wallet, Hourglass, CircleCheck, ThumbsUp, XCircle, Undo2, Info
} from 'lucide-react';

// --- Utility Functions/Components ---

// Helper function for number formatting
const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return 'N/A';
    // Ensure the number is a float before operations
    const numericNum = parseFloat(num);
    if (isNaN(numericNum)) return 'N/A';
    
    if (numericNum >= 1000000) return (numericNum / 1000000).toFixed(1) + 'M';
    if (numericNum >= 1000) return (numericNum / 1000).toFixed(1) + 'K';
    return numericNum.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function for currency formatting
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(parseFloat(amount))) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
};

const StatCard = ({ icon, title, value, change, changeType, gradientColors }) => {
    const IconComponent = icon;
    const isPositive = changeType === 'positive';
    
    // Fallback for null/undefined values
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
            {/* Change text is static as requested */}
            <div className={`flex items-center gap-1 text-sm mt-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{change || '0.0%'} vs. last month</span>
            </div>
        </div>
    );
};

// --- Statistics Component (Dynamic) ---

const Statistics = ({ statistics: data }) => {
    // Ensure data exists before processing
    const statistics = data || {};
    const dailyStats = statistics.dailyStats || [];

    // Data for the table
    const tableData = useMemo(() => {
        return dailyStats
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
            .slice(0, 15) // Limit to the last 15 days
            .map(stat => ({
                date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                properViews: formatNumber(stat.properViews),
                earnings: formatCurrency(stat.earnings),
                // dailyCPM is a number in the schema, so format it as currency but remove the dollar sign
                dailyCPM: formatCurrency(stat.dailyCPM).replace('$', ''), 
            }));
    }, [dailyStats]);

    // Data for the dummy chart (for visual representation, not functional SVG generation)
    const chartPoints = dailyStats
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(stat => stat.properViews || 0);

    // Calculate formatted values for StatCards, handling potential null/undefined data
    const totalImpressions = formatNumber(statistics.totalImpressions);
    const totalProperViews = formatNumber(statistics.totalProperViews);
    const totalEarnings = formatCurrency(statistics.totalEarnings);
    const averageCPM = formatCurrency(statistics.averageCPM).replace('$', '');

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Statistics</h2>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
                <StatCard 
                    icon={Eye} 
                    title="Total Impressions" 
                    value={totalImpressions} 
                    change="12.5%" 
                    changeType="positive" 
                    gradientColors="bg-gradient-to-br from-blue-400 to-blue-600"
                />
                <StatCard 
                    icon={CheckCircle2} 
                    title="Proper Views" 
                    value={totalProperViews} 
                    change="8.2%" 
                    changeType="positive" 
                    gradientColors="bg-gradient-to-br from-green-400 to-green-600"
                />
                <StatCard 
                    icon={DollarSign} 
                    title="Total Earnings" 
                    value={totalEarnings} 
                    change="1.5%" 
                    changeType="negative"
                    gradientColors="bg-gradient-to-br from-purple-400 to-purple-600"
                />
                <StatCard 
                    icon={BarChart3} 
                    title="Average CPM" 
                    value={averageCPM} 
                    change="3.1%" 
                    changeType="positive"
                    gradientColors="bg-gradient-to-br from-orange-400 to-orange-600"
                />
            </div>

            <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Views Overview (Last {chartPoints.length} Days)</h3>
                <div className="h-80 w-full rounded-lg p-4">
                    {/* Placeholder Chart: Replace with a real library like Recharts or Nivo using chartPoints data */}
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
                        {/* Static/Placeholder Grid Lines and Path */}
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
                <h3 className="text-xl font-semibold text-slate-800 p-6">Recent Performance (Last {tableData.length} Days)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 bg-slate-50/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Proper Views</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Daily CPM</th>
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
                    {tableData.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p>No daily statistics data found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- LinkCard Component (Dynamic Ready) ---

const LinkCard = ({ link, onCopy, onDelete, isDeleting }) => {
    // State to handle the copy button feedback
    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        // Use a generic short URL prefix for display
        const fullShortUrl = `https://yourdomain.com/${link.shortUrl}`;
        onCopy(fullShortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-grow min-w-0">
                    <p className="text-sm text-slate-500 truncate">{link.originalUrl}</p>
                    <a 
                        href={`https://yourdomain.com/${link.shortUrl}`} // Assuming a base domain for the short URL
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-lg font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        {`yourdomain.com/${link.shortUrl}`}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex items-center gap-4 text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                    <div className="text-center">
                        <p className="font-bold text-slate-800">{formatNumber(link.clicks)}</p>
                        <p className="text-xs">Clicks</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleCopyClick} 
                            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                            aria-label="Copy link"
                            disabled={isDeleting}
                        >
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={() => onDelete(link._id)} 
                            className="p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
                            aria-label="Delete link"
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ManageLinks Component (Dynamic & Functional) ---

const ManageLinks = ({ links: fetchedLinksArray, fetchData }) => {
    const { data: session } = useSession();
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Use an internal state for links, initialized with fetched data
    const [links, setLinks] = useState(fetchedLinksArray || []);

    // Effect to update links state when fetchedLinksArray prop changes
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

        const urlRegex = /^(https?:\/\/)[\w\-\.\/:]+\.[\w\-\.\/:]+([a-zA-Z0-9\-\.\/?%=&amp;]*)?$/;

        if (!longUrl || !urlRegex.test(longUrl)) {
            setIsError(true);
            setMessage('Please enter a valid URL (starting with http:// or https:// is recommended).');
            return;
        }
        
        // Simple sanitization for alias to prevent issues
        const safeAlias = alias ? alias.toLowerCase().replace(/[^a-z0-9-]/g, '') : '';

        setIsSubmitting(true);
        setIsError(false);
        setMessage('');

        try {
            const response = await fetch('/api/create-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalUrl: longUrl, 
                    customAlias: safeAlias, 
                    userEmail: session.user.email 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create link.');
            }

            // Successfully created, update local state
            setLinks([data.newLink, ...links]);
            setLongUrl('');
            setAlias('');
            setMessage(`Link created successfully! Short URL: ${data.newLink.shortUrl}`);
        } catch (error) {
            console.error('Link creation error:', error);
            setIsError(true);
            setMessage(error.message || 'An error occurred during link creation.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };
    
    const handleCopy = (fullShortUrl) => {
        navigator.clipboard.writeText(fullShortUrl);
    };
    
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
            return;
        }
        
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

            // Successfully deleted, update local state
            setLinks(links.filter(link => link._id !== id));
            setMessage('Link successfully deleted.');
            setIsError(false);
        } catch (error) {
            console.error('Link deletion error:', error);
            setIsError(true);
            setMessage(error.message || 'An error occurred during link deletion.');
        } finally {
            setIsDeleting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const filteredLinks = useMemo(() => {
        return links.filter(link => {
            const search = searchTerm.toLowerCase();
            return (
                (link.originalUrl && link.originalUrl.toLowerCase().includes(search)) ||
                (link.shortUrl && link.shortUrl.toLowerCase().includes(search))
            );
        });
    }, [links, searchTerm]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Manage Links</h2>

            <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
                <form onSubmit={handleShorten}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                placeholder="Enter a long URL to shorten" 
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="relative">
                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                placeholder="Custom alias (optional)" 
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            <Wand2 className="w-5 h-5" />
                            {isSubmitting ? 'Shortening...' : 'Shorten URL'}
                        </button>
                        {message && (
                            <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 p-6 pb-0">
                    <h3 className="text-xl font-semibold text-slate-800">Your Links ({links.length})</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search links..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>
                
                <div className="space-y-4 p-6 pt-0">
                    {filteredLinks.length > 0 ? (
                        filteredLinks.map(link => (
                           <LinkCard 
                                key={link._id} 
                                link={link} 
                                onCopy={handleCopy} 
                                onDelete={handleDelete} 
                                isDeleting={isDeleting}
                           />
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <p>No links found.</p>
                            <p className="text-sm">Try shortening a new URL or adjusting your filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Withdrawal Component (Dynamic & Functional) ---

const BalanceCard = ({ icon, title, amount, color }) => {
    const IconComponent = icon;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6 border border-slate-200/80">
            <div className={`p-4 rounded-full ${color}`}>
                <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div>
                <p className="text-slate-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800">{formatCurrency(amount)}</p>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const statusStyles = {
        Pending: { icon: Hourglass, color: 'text-orange-600 bg-orange-100', text: 'Pending' },
        Approved: { icon: ThumbsUp, color: 'text-blue-600 bg-blue-100', text: 'Approved' },
        Complete: { icon: CircleCheck, color: 'text-green-600 bg-green-100', text: 'Complete' },
        Cancelled: { icon: XCircle, color: 'text-slate-600 bg-slate-100', text: 'Cancelled' },
        Returned: { icon: Undo2, color: 'text-red-600 bg-red-100', text: 'Returned' },
    };
    const style = statusStyles[status] || statusStyles['Cancelled'];
    const Icon = style.icon;
    
    return (
        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium ${style.color}`}>
            <Icon className="w-3 h-3" />
            {style.text}
        </span>
    );
};

const Withdrawal = ({ withdrawal: data, fetchData }) => {
    const { data: session } = useSession();
    
    // Initialize state with fetched data, with fallbacks
    const [availableBalance, setAvailableBalance] = useState(data?.availableBalance || 0);
    const [pendingBalance, setPendingBalance] = useState(data?.pendingBalance || 0);
    const [totalWithdrawn, setTotalWithdrawn] = useState(data?.totalWithdrawn || 0);
    const [withdrawalHistory, setWithdrawalHistory] = useState(data?.history || []);

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    
    const MINIMUM_WITHDRAWAL_AMOUNT = 5.00; // Hardcoded minimum for UI

    // Update state when prop changes
    useEffect(() => {
        if (data) {
            setAvailableBalance(data.availableBalance || 0);
            setPendingBalance(data.pendingBalance || 0);
            setTotalWithdrawn(data.totalWithdrawn || 0);
            
            // Standardize and set history, sort by date descending
            const historyData = (data.history || [])
                .map(item => ({ 
                    ...item,
                    // Fallback date formatting
                    date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    withdrawalId: item.withdrawalId || `WID-${Math.random().toString(36).substr(2, 5)}`
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setWithdrawalHistory(historyData);
        }
    }, [data]);

    const handleWithdraw = async () => {
        if (!session?.user?.email) {
            setIsError(true);
            setMessage('Authentication error: Please sign in again.');
            setTimeout(() => setMessage(''), 4000);
            return;
        }

        if (availableBalance < MINIMUM_WITHDRAWAL_AMOUNT) {
            setIsError(true);
            setMessage(`You need at least ${formatCurrency(MINIMUM_WITHDRAWAL_AMOUNT)} to withdraw.`);
            setTimeout(() => setMessage(''), 4000);
            return;
        }
        
        // This is the amount that will be moved from available to pending
        const amountToWithdraw = availableBalance;
        
        setIsWithdrawing(true);
        setIsError(false);
        setMessage('');

        try {
            const response = await fetch('/api/req-withdrawal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userEmail: session.user.email,
                    amount: amountToWithdraw
                    // In a real app, you would also pass the selected payment method details
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Withdrawal request failed.');
            }

            // Simulate local state update based on successful API response
            // The API response should ideally contain the updated withdrawal object
            setAvailableBalance(data.updatedWithdrawal.availableBalance || 0);
            setPendingBalance(data.updatedWithdrawal.pendingBalance || 0);
            setTotalWithdrawn(data.updatedWithdrawal.totalWithdrawn || 0);
            
            // Refetch or update history with the new request
            // For simplicity and correctness, a full refetch is often safer in complex data structures
            await fetchData(session.user.email); 

            setIsError(false);
            setMessage('Your withdrawal request has been received and is now pending!');
        } catch (error) {
            console.error('Withdrawal error:', error);
            setIsError(true);
            setMessage(error.message || 'An error occurred during withdrawal request.');
        } finally {
            setIsWithdrawing(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };
    
    const canWithdraw = availableBalance >= MINIMUM_WITHDRAWAL_AMOUNT && !isWithdrawing;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Withdrawal</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
                <BalanceCard icon={Wallet} title="Available Balance" amount={availableBalance} color="bg-green-500" />
                <BalanceCard icon={Hourglass} title="Pending Withdrawal" amount={pendingBalance} color="bg-orange-500" />
                <BalanceCard icon={CircleCheck} title="Total Withdrawn" amount={totalWithdrawn} color="bg-blue-500" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-slate-200/80">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <button 
                        onClick={handleWithdraw}
                        disabled={!canWithdraw}
                        className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-in-out
                                enabled:hover:scale-105 enabled:hover:shadow-xl 
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isWithdrawing ? 'Processing...' : 'Withdraw'}
                    </button>
                    <div className="text-center sm:text-left">
                        <p className="text-slate-600">
                            When your account reaches the minimum of <strong className="text-slate-800">{formatCurrency(MINIMUM_WITHDRAWAL_AMOUNT)}</strong>, you may request your earnings.
                        </p>
                        {message && (
                            <p className={`mt-1 text-sm font-semibold ${isError ? 'text-red-500' : 'text-green-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 text-sm text-slate-500 space-y-2">
                    <p>Payments are sent to your withdrawal account during business days, no longer than 1 day after requesting.</p>
                    <p>To receive payments, you need to fill your payment details <a href="#" className="font-semibold text-blue-600 hover:underline">here</a>. Please ensure your Account Details are accurate.</p>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200/80">
                <h3 className="text-xl font-semibold text-slate-800 p-6">Withdrawal History ({withdrawalHistory.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                {['ID', 'Date', 'Status', 'Total Amount', 'Withdrawal Method', 'Withdrawal Account'].map(head => (
                                    <th key={head} className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawalHistory
                                .map(item => (
                                <tr key={item.withdrawalId} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap font-mono text-slate-500 text-sm">{item.withdrawalId}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                    <td className="p-4 whitespace-nowrap font-bold text-slate-800">{formatCurrency(item.totalAmount)}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700">{item.withdrawalMethod || 'N/A'}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700 truncate">{item.withdrawalAccount || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {withdrawalHistory.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p>No withdrawal history found.</p>
                        </div>
                    )}
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

// --- Refferals (unchanged placeholder) ---

const Refferals = () => (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
        <h2 className='text-3xl font-bold mb-6 text-slate-800'>Referrals</h2>
        <div className='bg-white p-8 rounded-2xl shadow-md'>
            <p className='text-lg font-medium text-slate-700'>Referrals feature coming soon! Check back for your unique referral link and earnings data.</p>
        </div>
    </div>
);

// --- MainContent (Updated for Data Fetching) ---

export const MainContent = ({ activeContent }) => {
    const { data: session } = useSession();
    const [dashboardData, setDashboardData] = useState({ statistics: null, links: [], withdrawal: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const email = session?.user?.email;

    const fetchData = useCallback(async (userEmail) => {
        if (!userEmail) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/dashboard', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch dashboard data: Status ${response.status}`);
            }

            const data = await response.json();
            
            setDashboardData({
                statistics: data.statistics,
                // Ensure links is an array, falling back to empty array if null/undefined
                links: data.links || [], 
                withdrawal: data.withdrawal,
            });

        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || 'An unknown error occurred while fetching data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only fetch data if the email is available
        if (email) {
            fetchData(email);
        } else if (session !== undefined && !session) {
             // If session is explicitly null (not just pending), stop loading
             setIsLoading(false);
        }
    }, [email, fetchData, session]); // Depend on email and fetchData

    const contentMap = useMemo(() => ({
        statistics: <Statistics statistics={dashboardData.statistics} />,
        // Pass fetchData to ManageLinks so it can trigger a refresh if needed
        'manage-links': <ManageLinks links={dashboardData.links} fetchData={fetchData} />, 
        // Pass fetchData to Withdrawal so it can refresh balances/history after a request
        withdrawal: <Withdrawal withdrawal={dashboardData.withdrawal} fetchData={fetchData} />,
        refferals: <Refferals />,
    }), [dashboardData, fetchData]);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="flex-shrink-0 flex w-full h-20 items-center justify-between px-6 bg-white border-b">
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="whitespace-nowrap rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-400 shadow-md"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                {isLoading && (
                    <div className="text-center py-20 text-blue-500">
                        <svg className="animate-spin h-8 w-8 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p>Loading Dashboard Data...</p>
                    </div>
                )}
                
                {error && (
                    <div className="p-6">
                        <div className="text-center py-10 text-red-600 bg-red-50 rounded-2xl border border-red-200 shadow-lg">
                            <p className="font-bold text-lg mb-2">Data Fetch Error 😢</p>
                            <p className="text-sm">{error}</p>
                            <p className="text-xs mt-2">Check the server logs and database connection.</p>
                        </div>
                    </div>
                )}

                {!isLoading && !error && (
                    contentMap[activeContent] || <div className='p-6 text-center text-slate-500'><p>Select a section from the sidebar</p></div>
                )}
            </main>
        </div>
    );
};