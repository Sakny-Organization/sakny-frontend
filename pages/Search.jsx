import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/common/PageTransition';
import { fetchMatches, resetFilters, setSortBy, updateFilters } from '../slices/matchSlice';
import searchService from '../services/searchService';
import { Building2, Filter, RotateCcw, Search as SearchIcon, SlidersHorizontal, Users, X } from 'lucide-react';
import { filterPanelVariants } from '../utils/animations';
import Properties from './properties/Properties';

const filterOptions = searchService.getSearchFilterOptions();

const Search = () => {
    const dispatch = useDispatch();
    const { items, filters, status, sortBy, meta } = useSelector((state) => state.matches);
    const [showFilters, setShowFilters] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('roommates');

    React.useEffect(() => {
        dispatch(fetchMatches(filters));
    }, [dispatch, filters]);

    const sortedItems = React.useMemo(() => {
        const nextItems = [...items];
        if (sortBy === 'price-low') return nextItems.sort((left, right) => left.budget - right.budget);
        if (sortBy === 'price-high') return nextItems.sort((left, right) => right.budget - left.budget);
        return nextItems.sort((left, right) => right.matchPercentage - left.matchPercentage);
    }, [items, sortBy]);

    const activeFilters = React.useMemo(() => {
        const current = [];
        if (filters.city) current.push({ key: 'city', label: `City: ${filters.city}` });
        if (filters.gender !== 'All') current.push({ key: 'gender', label: `Gender: ${filters.gender}` });
        if (filters.smoking !== 'Any') current.push({ key: 'smoking', label: `Smoking: ${filters.smoking}` });
        if (filters.pets !== 'Any') current.push({ key: 'pets', label: `Pets: ${filters.pets}` });
        if (filters.cleanliness !== 'Any') current.push({ key: 'cleanliness', label: `Cleanliness: ${filters.cleanliness}` });
        if (filters.budgetRange.min !== 500 || filters.budgetRange.max !== 9000) {
            current.push({ key: 'budget', label: `Budget: ${filters.budgetRange.min.toLocaleString()} - ${filters.budgetRange.max.toLocaleString()} EGP` });
        }
        filters.lifestyle.forEach((trait) => current.push({ key: `lifestyle-${trait}`, type: 'lifestyle', trait, label: trait }));
        return current;
    }, [filters]);

    const removeFilter = (filter) => {
        if (filter.key === 'city') dispatch(updateFilters({ city: '' }));
        if (filter.key === 'gender') dispatch(updateFilters({ gender: 'All' }));
        if (filter.key === 'smoking') dispatch(updateFilters({ smoking: 'Any' }));
        if (filter.key === 'pets') dispatch(updateFilters({ pets: 'Any' }));
        if (filter.key === 'cleanliness') dispatch(updateFilters({ cleanliness: 'Any' }));
        if (filter.key === 'budget') dispatch(updateFilters({ budgetRange: { min: 500, max: 9000 } }));
        if (filter.type === 'lifestyle') dispatch(updateFilters({ lifestyle: filters.lifestyle.filter((item) => item !== filter.trait) }));
    };

    const renderFilterPanel = () => (
        <div className="search-panel__content">
            <div className="search-panel__header">
                <h3><Filter size={16} /> Filters</h3>
                <button type="button" className="search-panel__reset" onClick={() => dispatch(resetFilters())}>
                    <RotateCcw size={14} /> Reset
                </button>
            </div>

            <div className="search-panel__section">
                <label>City</label>
                <Input placeholder="Cairo, Giza, Alexandria" value={filters.city} onChange={(event) => dispatch(updateFilters({ city: event.target.value }))} />
            </div>

            <div className="search-panel__section">
                <label>Budget range</label>
                <div className="search-budget-grid">
                    <Input type="number" min="500" max="9000" value={filters.budgetRange.min} onChange={(event) => dispatch(updateFilters({ budgetRange: { min: Number(event.target.value) || 500 } }))} />
                    <Input type="number" min="500" max="9000" value={filters.budgetRange.max} onChange={(event) => dispatch(updateFilters({ budgetRange: { max: Number(event.target.value) || 9000 } }))} />
                </div>
            </div>

            <div className="search-panel__section">
                <label>Gender</label>
                <select className="search-select" value={filters.gender} onChange={(event) => dispatch(updateFilters({ gender: event.target.value }))}>
                    <option value="All">Any</option>
                    <option value="Male">Male only</option>
                    <option value="Female">Female only</option>
                </select>
            </div>

            <div className="search-panel__section">
                <label>Lifestyle</label>
                <div className="search-chip-group">
                    {filterOptions.lifestyle.map((trait) => (
                        <button key={trait} type="button" className={`search-chip ${filters.lifestyle.includes(trait) ? 'is-active' : ''}`} onClick={() => dispatch(updateFilters({ lifestyle: filters.lifestyle.includes(trait) ? filters.lifestyle.filter((item) => item !== trait) : [...filters.lifestyle, trait] }))}>
                            {trait}
                        </button>
                    ))}
                </div>
            </div>

            <div className="search-panel__section">
                <label>Smoking</label>
                <div className="search-chip-group">
                    {filterOptions.smoking.map((option) => (
                        <button key={option} type="button" className={`search-chip ${filters.smoking === option ? 'is-active' : ''}`} onClick={() => dispatch(updateFilters({ smoking: option }))}>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="search-panel__section">
                <label>Pets</label>
                <div className="search-chip-group">
                    {filterOptions.pets.map((option) => (
                        <button key={option} type="button" className={`search-chip ${filters.pets === option ? 'is-active' : ''}`} onClick={() => dispatch(updateFilters({ pets: option }))}>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="search-panel__section">
                <label>Cleanliness</label>
                <div className="search-chip-group">
                    {filterOptions.cleanliness.map((option) => (
                        <button key={option} type="button" className={`search-chip ${filters.cleanliness === option ? 'is-active' : ''}`} onClick={() => dispatch(updateFilters({ cleanliness: option }))}>
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderRoommateSearch = () => (
        <>
            <div className="search-page__hero">
                <div>
                    <h1 className="text-3xl font-bold text-black">Find your next roommate</h1>
                    <p className="text-gray-600">API-ready search state, realistic loading patterns, and compatibility-rich results.</p>
                </div>
                <button type="button" className="search-page__filter-toggle" onClick={() => setShowFilters((current) => !current)}>
                    <SlidersHorizontal size={16} /> Filters
                </button>
            </div>

            <div className="search-page__active-filters">
                {activeFilters.length === 0 ? <span className="search-page__empty-filter-copy">No active filters</span> : activeFilters.map((filter) => (<button key={filter.key} type="button" className="search-page__pill" onClick={() => removeFilter(filter)}>
                    <span>{filter.label}</span>
                    <X size={14} />
                </button>))}
            </div>

            <AnimatePresence>
                {showFilters && (<motion.div className="search-panel search-panel--mobile" variants={filterPanelVariants} initial="closed" animate="open" exit="closed">
                    {renderFilterPanel()}
                </motion.div>)}
            </AnimatePresence>

            <div className="search-layout">
                <aside className="search-panel search-panel--desktop">
                    {renderFilterPanel()}
                </aside>

                <section className="search-results">
                    <div className="search-results__toolbar">
                        <div>
                            <strong>{status === 'loading' ? 'Loading matches...' : `${meta.total || sortedItems.length} results`}</strong>
                            <p>{meta.hasActiveFilters ? 'Filtered for your current preferences' : 'Showing the full recommendation pool'}</p>
                        </div>
                        <div className="search-results__sort">
                            <SearchIcon size={16} />
                            <select className="search-select" value={sortBy} onChange={(event) => dispatch(setSortBy(event.target.value))}>
                                <option value="match">Best match</option>
                                <option value="price-low">Price: low to high</option>
                                <option value="price-high">Price: high to low</option>
                            </select>
                        </div>
                    </div>

                    {status === 'loading' && (
                        <div className="search-results__grid">
                            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
                        </div>
                    )}

                    {status !== 'loading' && sortedItems.length > 0 && (
                        <div className="search-results__grid">
                            {sortedItems.map((roommate) => (<RoommateCard key={roommate.id} roommate={roommate} />))}
                        </div>
                    )}

                    {status !== 'loading' && sortedItems.length === 0 && (
                        <EmptyState
                            icon={<SearchIcon size={28} />}
                            title="No matches found"
                            description="Try widening your budget range, switching city, or clearing one of the preference filters."
                            actionLabel="Clear filters"
                            onAction={() => dispatch(resetFilters())}
                        />
                    )}
                </section>
            </div>
        </>
    );

    return (<PageTransition>
        <div className="app-container search-page">
            <div className="search-tabs">
                <button type="button" className={`search-tabs__item ${activeTab === 'roommates' ? 'is-active' : ''}`} onClick={() => setActiveTab('roommates')}>
                    <Users size={16} />
                    <span>Roommates</span>
                </button>
                <button type="button" className={`search-tabs__item ${activeTab === 'properties' ? 'is-active' : ''}`} onClick={() => setActiveTab('properties')}>
                    <Building2 size={16} />
                    <span>Properties</span>
                </button>
            </div>

            {activeTab === 'roommates' ? renderRoommateSearch() : <Properties embedded />}
        </div>
    </PageTransition>);
};

export default Search;
