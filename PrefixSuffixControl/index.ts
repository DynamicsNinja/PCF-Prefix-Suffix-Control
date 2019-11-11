import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PrefixSuffixControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;

	private _textboxOnChange: EventListenerOrEventListenerObject;
	private _updateSuffix: EventListenerOrEventListenerObject;

	private _textbox: HTMLInputElement;
	private _suffix: HTMLSpanElement;

	private _isLockedField: boolean;

	private _value: number | null;
	
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;

		this._textboxOnChange = this.textboxOnChange.bind(this);
		this._updateSuffix = this.updateSuffix.bind(this);

		this._value = context.parameters.valueField.raw;

		let outerContainer = document.createElement("div");
		outerContainer.classList.add("container");

		let suffixString = context.parameters.suffix.raw || "";

		let textbox = document.createElement("input");
		textbox.addEventListener("change", this._textboxOnChange);
		textbox.addEventListener('input', this._updateSuffix);
		textbox.addEventListener('focus', this._updateSuffix);
		textbox.type = "number";
		textbox.placeholder = "---";
		if(this._value != null){ textbox.value = this._value +""; }

		let suffix = document.createElement("span");
		suffix.innerHTML = suffixString;
		suffix.classList.add("suffix");
		suffix.hidden = this._value == null;
		this._suffix = suffix;

		this._textbox = textbox;
		
		outerContainer.appendChild(textbox);
		outerContainer.appendChild(suffix);

		container.appendChild(outerContainer);

		const width = this.getTextWidth(this._textbox);
		this._suffix.style.left = width + 'px';
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._isLockedField = context.mode.isControlDisabled;
		this._textbox.disabled = this._isLockedField;
	}

	public getOutputs(): IOutputs
	{
		return {
			valueField: this._value!
		};
	}

	public destroy(): void
	{
		this._textbox.removeEventListener("change", this._textboxOnChange);
		this._textbox.removeEventListener('input', this._updateSuffix);
		this._textbox.removeEventListener('focus', this._updateSuffix);
	}

	public textboxOnChange():void{
		this._value = this._textbox.value == "" ? null : +this._textbox.value;
		this._suffix.hidden = this._textbox.value == "";
		this._notifyOutputChanged();
	}

	public updateSuffix():void {
		const width = this.getTextWidth(this._textbox);
		this._suffix.hidden = this._textbox.value == "";
		this._suffix.style.left = width + 'px';		
	}

	public getTextWidth(textbox:HTMLInputElement) {
		var tag = document.createElement("div");
		tag.style.position = "absolute";
		tag.style.left = "-999em";
		tag.style.whiteSpace = "nowrap";
		tag.style.font = window.getComputedStyle(textbox).font;
		tag.innerHTML = textbox.value;
	
		document.body.appendChild(tag);
	
		var result = tag.clientWidth;
	
		document.body.removeChild(tag);
	
		return result;
	}
}