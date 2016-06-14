# FENIX Filter

# Configuration

```javascript
var filter = new Filter(options);
```

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Default Value</th>
      <th>Example</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>el</td>
      <td>CSS3 Selector/JavaScript DOM element/jQuery DOM element</td>
      <td> - </td>
      <td>"#container"</td>
      <td>component container</td>
    </tr>
    
    
    <tr>
            <td>selectorRegistry</td>
            <td>object</td>
            <td>{
                                'dropdown': {
                                    path: selectorPath + 'dropdown'
                                },
                                'tree': {
                                    path: selectorPath + 'tree'
                                },
                                'input': {
                                    path: selectorPath + 'input'
                                },
                                'range': {
                                    path: selectorPath + 'range'
                                },
                                'time': {
                                    path: selectorPath + 'time'
                                },
                                'sortable': {
                                    path: selectorPath + 'sortable'
                                }
                            }</td>
            <td>-</td>
            <td>Keyset: plugins' ids. Value: object. path: plugin module path</td>
          </tr>
    
       
    <tr>
      <td>focusedSelectorClassName</td>
      <td>string</td>
      <td>"focused"</td>
      <td>"my-focused"</td>
      <td>CSS class applied to make a selector focused</td>
    </tr>
    
     <tr>
          <td>mandatorySelectorClassName</td>
          <td>string</td>
          <td>"mandatory"</td>
          <td>"my-mandatory"</td>
          <td>CSS class applied to make a selector mandatory</td>
        </tr>
            
     <tr>
          <td>disabledSelectorClassName</td>
          <td>string</td>
          <td>"disabled"</td>
          <td>"my-disabled"'</td>
          <td>CSS class applied to make a selector disabled</td>
        </tr>
         <tr>
          <td>outputFormat</td>
          <td>string</td>
          <td>"plain"</td>
          <td>plain || fenix || catalog</td>
          <td>Default output format of getValues() fn</td>
        </tr>
        
             <tr>
              <td>direction</td>
              <td>string</td>
              <td>"append"</td>
              <td>"prepend"</td>
              <td>Direction of how the selector are added (if no template is provided)</td>
            </tr>

 <tr>
              <td>ensureAtLeast</td>
              <td>number</td>
              <td>-1</td>
              <td>1/td>
              <td>Min number of selector per filter instance</td>
            </tr>
 <tr>
              <td>template</td>
              <td>object</td>
              <td>{
                                  hideRemoveButton: true,
                                  hideSwitch: true,
                                  hideHeaderIcon: true
                              }</td>
              <td>-/td>
              <td>Default template options</td>
            </tr>
    
  </tbody>
</table>

# API



