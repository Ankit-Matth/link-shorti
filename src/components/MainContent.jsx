"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Eye, CheckCircle2, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight,
  Link as LinkIcon, Sparkles, Wand2, Search, Copy, Check, Trash2, Edit, ExternalLink,
  Wallet, Hourglass, CircleCheck, ThumbsUp, XCircle, Undo2, Info
 } from 'lucide-react';

const StatCard = ({ icon, title, value, change, changeType, gradientColors }) => {
  const IconComponent = icon;
  const isPositive = changeType === 'positive';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-slate-500 font-medium">{title}</span>
          <span className="text-3xl font-bold text-slate-800 mt-1">{value}</span>
        </div>
        <div className={`rounded-full p-3 ${gradientColors}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className={`flex items-center gap-1 text-sm mt-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        <span>{change} vs. last month</span>
      </div>
    </div>
  );
};

const Statistics = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const data = Array.from({ length: 15 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (i + 1));
            const properViews = Math.floor(Math.random() * (5000 - 1500 + 1) + 1500);
            const earnings = parseFloat((properViews / 1000) * (Math.random() * (5 - 2) + 2)).toFixed(2);
            const dailyCPM = ((earnings / properViews) * 1000).toFixed(2);
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                properViews: properViews.toLocaleString(),
                earnings: `${earnings}`,
                dailyCPM: `${dailyCPM}`,
            };
        });
        setTableData(data);
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Statistics</h2>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
                <StatCard 
                  icon={Eye} 
                  title="Total Impressions" 
                  value="1.2M" 
                  change="12.5%" 
                  changeType="positive" 
                  gradientColors="bg-gradient-to-br from-blue-400 to-blue-600"
                />
                <StatCard 
                  icon={CheckCircle2} 
                  title="Proper Views" 
                  value="845K" 
                  change="8.2%" 
                  changeType="positive" 
                  gradientColors="bg-gradient-to-br from-green-400 to-green-600"
                />
                <StatCard 
                  icon={DollarSign} 
                  title="Total Earnings" 
                  value="$4,823" 
                  change="1.5%" 
                  changeType="negative"
                  gradientColors="bg-gradient-to-br from-purple-400 to-purple-600"
                />
                <StatCard 
                  icon={BarChart3} 
                  title="Average CPM" 
                  value="$5.71" 
                  change="3.1%" 
                  changeType="positive"
                  gradientColors="bg-gradient-to-br from-orange-400 to-orange-600"
                />
            </div>

            <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Views Overview (Last 10 Days)</h3>
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
                <h3 className="text-xl font-semibold text-slate-800 p-6">Recent Performance (Last 15 Days)</h3>
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
                </div>
            </div>
        </div>
    );
};

const LinkCard = ({ link, onCopy, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-grow min-w-0">
                    <p className="text-sm text-slate-500 truncate">{link.original}</p>
                    <a 
                        href={`https://${link.short}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-lg font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        {link.short}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex items-center gap-4 text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                    <div className="text-center">
                        <p className="font-bold text-slate-800">{link.clicks}</p>
                        <p className="text-xs">Clicks</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onCopy(link.short)} 
                            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                            aria-label="Copy link"
                        >
                            {link.copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Edit link">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => onDelete(link.id)} 
                            className="p-2 rounded-full hover:bg-red-100 transition-colors"
                            aria-label="Delete link"
                        >
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageLinks = () => {
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [links, setLinks] = useState([
        { id: 1, original: 'https://github.com/facebook/react/issues/12345', short: 'short.ly/react-issue', clicks: 1428, copied: false },
        { id: 2, original: 'https://tailwindcss.com/docs/guides/nextjs', short: 'short.ly/tailwind-next', clicks: 876, copied: false },
        { id: 3, original: 'https://vercel.com/docs/concepts/projects/overview', short: 'short.ly/vercel-docs', clicks: 203, copied: false },
    ]);

    const handleShorten = (e) => {
        e.preventDefault();
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\\w \.-]*)*\/?$/;

        if (!urlRegex.test(longUrl)) {
            setIsError(true);
            setMessage('Please enter a valid URL.');
            return;
        }

        const newLink = {
            id: Date.now(),
            original: longUrl,
            short: `short.ly/${alias || Math.random().toString(36).substr(2, 6)}`,
            clicks: 0,
            copied: false,
        };

        setLinks([newLink, ...links]);
        setLongUrl('');
        setAlias('');
        setIsError(false);
        setMessage('Your link has been successfully shortened!');
        
        setTimeout(() => setMessage(''), 3000);
    };
    
    const handleCopy = (shortUrl) => {
        navigator.clipboard.writeText(`https://${shortUrl}`);
        setLinks(links.map(link => 
            link.short === shortUrl ? { ...link, copied: true } : link
        ));
        setTimeout(() => {
            setLinks(links.map(link => 
                link.short === shortUrl ? { ...link, copied: false } : link
            ));
        }, 2000);
    };
    
    const handleDelete = (id) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const filteredLinks = useMemo(() => {
        return links.filter(link => 
            link.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.short.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
                        >
                            <Wand2 className="w-5 h-5" />
                            Shorten URL
                        </button>
                        {message && (
                            <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
            
            <div className='bg-white p-6 rounded-2xl shadow-md'>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">Your Links</h3>
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
                
                <div className="space-y-4">
                    {filteredLinks.length > 0 ? (
                        filteredLinks.map(link => (
                           <LinkCard key={link.id} link={link} onCopy={handleCopy} onDelete={handleDelete} />
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

const BalanceCard = ({ icon, title, amount, color }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6 border border-slate-200/80">
      <div className={`p-4 rounded-full ${color}`}>
        <IconComponent className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-slate-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-800">${amount.toFixed(2)}</p>
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

const Withdrawal = () => {
    const [availableBalance, setAvailableBalance] = useState(157.45);
    const [pendingBalance, setPendingBalance] = useState(25.50);
    const [totalWithdrawn, setTotalWithdrawn] = useState(1240.80);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const MINIMUM_WITHDRAWAL_AMOUNT = 5.00;

    const [withdrawalHistory, setWithdrawalHistory] = useState([
        { id: 'WID-84321', date: '2025-09-15', status: 'Complete', pubEarnings: 45.10, refEarnings: 4.90, total: 50.00, method: 'PayPal', account: 'user@example.com' },
        { id: 'WID-84199', date: '2025-09-01', status: 'Complete', pubEarnings: 72.30, refEarnings: 0, total: 72.30, method: 'Payoneer', account: 'user@payoneer.com' },
        { id: 'WID-84056', date: '2025-08-28', status: 'Cancelled', pubEarnings: 20.00, refEarnings: 0, total: 20.00, method: 'PayPal', account: 'user@example.com' },
        { id: 'WID-83912', date: '2025-08-25', status: 'Returned', pubEarnings: 15.00, refEarnings: 2.50, total: 17.50, method: 'Skrill', account: 'user@skrill.com' },
    ]);

    const handleWithdraw = () => {
        if (availableBalance < MINIMUM_WITHDRAWAL_AMOUNT) {
            setIsError(true);
            setMessage(`You need at least $${MINIMUM_WITHDRAWAL_AMOUNT.toFixed(2)} to withdraw.`);
            setTimeout(() => setMessage(''), 4000);
            return;
        }

        const amountToWithdraw = availableBalance;
        
        const newWithdrawal = {
            id: `WID-${Math.floor(Math.random() * (99999 - 85000) + 85000)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            pubEarnings: amountToWithdraw,
            refEarnings: 0,
            total: amountToWithdraw,
            method: 'PayPal',
            account: 'user@example.com'
        };

        setAvailableBalance(0);
        setPendingBalance(pendingBalance + amountToWithdraw);
        setWithdrawalHistory([newWithdrawal, ...withdrawalHistory]);
        setIsError(false);
        setMessage('Your withdrawal request has been received!');
        setTimeout(() => setMessage(''), 4000);
    };
    
    const canWithdraw = availableBalance >= MINIMUM_WITHDRAWAL_AMOUNT;

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
                        Withdraw
                    </button>
                    <div className="text-center sm:text-left">
                         <p className="text-slate-600">
                           When your account reaches the minimum of <strong className="text-slate-800">${MINIMUM_WITHDRAWAL_AMOUNT.toFixed(2)}</strong>, you may request your earnings.
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
                <h3 className="text-xl font-semibold text-slate-800 p-6">Withdrawal History</h3>
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
                            {withdrawalHistory.map(item => (
                                <tr key={item.id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap font-mono text-slate-500 text-sm">{item.id}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700">{item.date}</td>
                                    <td className="p-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                    <td className="p-4 whitespace-nowrap font-bold text-slate-800">${item.total.toFixed(2)}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700">{item.method}</td>
                                    <td className="p-4 whitespace-nowrap text-slate-700 truncate">{item.account}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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


const Refferals = () => <div className="p-6"> <h2 className='text-2xl font-bold mb-4'>Refferals</h2> <div className='bg-white p-8 rounded-lg shadow-md'><p>Coming Soon...</p></div> </div>;

const contentMap = {
  statistics: <Statistics />,
  'manage-links': <ManageLinks />,
  withdrawal: <Withdrawal />,
  refferals: <Refferals />,
};

export const MainContent = ({ activeContent }) => {
  const { data: session } = useSession();

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

      <main className="flex-1 p-6 overflow-y-auto">
        {contentMap[activeContent] || <div>Select a section from the sidebar</div>}
      </main>
    </div>
  );
};