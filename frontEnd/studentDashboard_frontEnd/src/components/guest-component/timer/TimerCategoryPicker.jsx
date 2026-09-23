import { useState } from "react"

function TimerCategoryPicker({ categories, selectedCategory, disabled, onSelect, onAdd }) {
    const [isAdding, setIsAdding] = useState(false)
    const [newCategory, setNewCategory] = useState("")
    const [error, setError] = useState("")

    const submitCategory = event => {
        event.preventDefault()
        const category = newCategory.trim()

        if (!category) {
            setError("Enter a category name.")
            return
        }
        if (categories.some(item => item.toLowerCase() === category.toLowerCase())) {
            setError("That category already exists.")
            return
        }

        onAdd(category)
        setNewCategory("")
        setError("")
        setIsAdding(false)
    }

    return (
        <div className="category-picker">
            <label htmlFor="timer-category">Time category</label>
            <div className="category-picker-row">
                <select
                    id="timer-category"
                    value={selectedCategory}
                    onChange={event => onSelect(event.target.value)}
                    disabled={disabled}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <button
                    type="button"
                    className="category-add-toggle"
                    onClick={() => {
                        setIsAdding(value => !value)
                        setError("")
                    }}
                    aria-expanded={isAdding}
                    disabled={disabled}
                >
                    + New
                </button>
            </div>
            {disabled && <p className="category-hint">Category is locked during a work cycle.</p>}
            {isAdding && (
                <form className="category-form" onSubmit={submitCategory}>
                    <input
                        autoFocus
                        type="text"
                        maxLength="32"
                        value={newCategory}
                        onChange={event => setNewCategory(event.target.value)}
                        placeholder="Category name"
                        aria-label="New category name"
                        aria-describedby={error ? "category-error" : undefined}
                    />
                    <button type="submit" className="save-button">Add</button>
                    <button type="button" className="cancel-button" onClick={() => setIsAdding(false)}>Cancel</button>
                    {error && <p id="category-error" className="category-error" role="alert">{error}</p>}
                </form>
            )}
        </div>
    )
}

export default TimerCategoryPicker
